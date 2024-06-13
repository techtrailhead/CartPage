const express = require("express");
const app = express();
const port = 3000;

// Server-side values
const freeShippingThreshold = 100;
const taxRate = 5; // 5%
const discountPercentage = 10; // 10%
const loyaltyRate = 2; // 2 points per $1

// Function to calculate cart total
function calculateCartTotal(item1Price, item2Price, item3Price) {
  return item1Price + item2Price + item3Price;
}

// Endpoint 1: Calculate the total price of items in the cart
app.get("/cart-total", (req, res) => {
  let item1Price = parseFloat(req.query.item1Price);
  let item2Price = parseFloat(req.query.item2Price);
  let item3Price = parseFloat(req.query.item3Price);
  let total = calculateCartTotal(item1Price, item2Price, item3Price);
  res.send(total.toString());
});

// Function to check free shipping eligibility
function checkFreeShipping(cartTotal) {
  return cartTotal >= freeShippingThreshold;
}

// Endpoint 2: Check if the cart total is eligible for free shipping
app.get("/free-shipping", (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let eligible = checkFreeShipping(cartTotal);
  res.send(eligible.toString());
});

// Function to apply membership discount
function applyMembershipDiscount(cartTotal, isMember) {
  if (isMember) {
    return cartTotal - (cartTotal * (discountPercentage / 100));
  }
  return cartTotal;
}

// Endpoint 3: Apply a discount based on membership status
app.get("/membership-discount", (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === "true";
  let finalPrice = applyMembershipDiscount(cartTotal, isMember);
  res.send(finalPrice.toString());
});

// Function to calculate tax
function calculateTax(cartTotal) {
  return cartTotal * (taxRate / 100);
}

// Endpoint 4: Calculate tax on the cart total
app.get("/calculate-tax", (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let tax = calculateTax(cartTotal);
  res.send(tax.toString());
});

// Function to estimate delivery time
function estimateDeliveryTime(shippingMethod, distance) {
  if (shippingMethod === "express") {
    return distance / 100 * 1; // 1 day per 100 km
  } else if (shippingMethod === "standard") {
    return distance / 50 * 1; // 1 day per 50 km
  } else {
    return "Unknown shipping method";
  }
}

// Endpoint 5: Estimate delivery time based on shipping method
app.get("/estimate-delivery", (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  let deliveryTime = estimateDeliveryTime(shippingMethod, distance);
  res.send(deliveryTime.toString());
});

// Function to calculate discounted price
function calculateDiscountedPrice(originalPrice, discountPercentage) {
  return originalPrice - (originalPrice * (discountPercentage / 100));
}

// Endpoint 7: Calculate the price after applying a discount code
app.get("/discounted-price", (req, res) => {
  let originalPrice = parseFloat(req.query.originalPrice);
  let finalPrice = calculateDiscountedPrice(originalPrice, discountPercentage);
  res.send(finalPrice.toString());
});

// Function to calculate shipping cost
function calculateShippingCost(weight, distance) {
  return weight * distance * 0.1; // $0.1 per km per kg
}

// Endpoint 8: Calculate the shipping cost based on weight and distance
app.get("/shipping-cost", (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  let shippingCost = calculateShippingCost(weight, distance);
  res.send(shippingCost.toString());
});

// Function to calculate loyalty points
function calculateLoyaltyPoints(purchaseAmount) {
  return purchaseAmount * loyaltyRate;
}

// Endpoint 9: Calculate loyalty points earned from a purchase
app.get("/loyalty-points", (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  let points = calculateLoyaltyPoints(purchaseAmount);
  res.send(points.toString());
});

// Function to validate promo code
function validatePromoCode(promoCode, cartTotal) {
  if (promoCode === "SAVE10" && cartTotal >= 50) {
    return "Promo code is valid";
  } else {
    return "Promo code is invalid";
  }
}

// Endpoint 10: Validate if a promo code is applicable
app.get("/validate-promo", (req, res) => {
  let promoCode = req.query.promoCode;
  let cartTotal = parseFloat(req.query.cartTotal);
  let validationMessage = validatePromoCode(promoCode, cartTotal);
  res.send(validationMessage);
});

app.listen(port, () => {
  console.log(`Server is running on <http://localhost>:${port}`);
});
