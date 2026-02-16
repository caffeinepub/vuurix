import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration from backend/upgrade/migration.mo before actor creation
(with migration = Migration.run)
actor {
  type OrderId = Nat;
  type ProductId = Nat;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    sizes : [Text];
    colors : [Text];
  };

  type OrderItem = {
    productId : ProductId;
    quantity : Nat;
    size : ?Text;
    color : ?Text;
  };

  type Order = {
    id : OrderId;
    owner : Principal;
    items : [OrderItem];
    total : Nat;
    timestamp : Time.Time;
  };

  var nextProductId = 1;
  var nextOrderId = 1;

  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();

  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageUrl : Text,
    sizes : [Text],
    colors : [Text],
  ) : async ProductId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    let product : Product = {
      id = productId;
      name;
      description;
      price;
      category;
      imageUrl;
      sizes;
      colors;
    };

    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public query func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func createOrder(items : [OrderItem], total : Nat) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let orderId = nextOrderId;
    let order : Order = {
      id = orderId;
      owner = caller;
      items;
      total;
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    nextOrderId += 1;
    orderId;
  };

  public query ({ caller }) func getOrder(id : OrderId) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      orders.values().toArray();
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      orders.values().filter(func(order : Order) : Bool { order.owner == caller }).toArray();
    } else {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
  };

  public shared ({ caller }) func updateProduct(
    id : ProductId,
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageUrl : Text,
    sizes : [Text],
    colors : [Text],
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          category;
          imageUrl;
          sizes;
          colors;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    products.remove(id);
  };
};
