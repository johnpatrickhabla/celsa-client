"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice);

  if (items.length === 0) {
    return (
      <div className="container-fluid px-4 py-5 text-center">
        <i className="bi bi-cart3 fs-1 text-muted d-block mb-3" />
        <h5 className="fw-bold">Your cart is empty</h5>
        <p className="text-muted small">
          Browse our products and add items to your cart.
        </p>
        <Link href="/products" className="btn btn-success">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          Shopping Cart
          <span className="text-muted fw-normal ms-2 fs-6">
            ({items.length} item{items.length !== 1 ? "s" : ""})
          </span>
        </h4>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart items */}
        <div className="col-lg-8">
          {items.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className="border rounded p-3 mb-3 d-flex gap-3"
            >
              {/* Image */}
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                style={{ width: 100, height: 100 }}
              >
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <i className="bi bi-image text-muted fs-4" />
                )}
              </div>

              {/* Details */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <div>
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="fw-semibold text-dark text-decoration-none"
                    >
                      {item.productName}
                    </Link>
                    {item.customizations.length > 0 && (
                      <div className="text-muted small mt-1">
                        {item.customizations.map((c) => (
                          <span key={c.type} className="me-2">
                            {c.label}: <strong>{c.selectedValue}</strong>
                            {c.priceModifier > 0 && (
                              <span className="text-success ms-1">
                                (+₱{c.priceModifier})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() => removeItem(index)}
                    aria-label="Remove item"
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  {/* Quantity controls */}
                  <div className="d-flex align-items-center border rounded">
                    <button
                      className="btn btn-sm btn-light border-0"
                      onClick={() => updateQty(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="bi bi-dash" />
                    </button>
                    <span className="px-3 small fw-semibold">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm btn-light border-0"
                      onClick={() => updateQty(index, item.quantity + 1)}
                    >
                      <i className="bi bi-plus" />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="fw-bold text-success">
                    ₱{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="col-lg-4">
          <div className="border rounded p-4">
            <h6 className="fw-bold mb-3">Order Summary</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Subtotal</span>
              <span className="fw-semibold">₱{totalPrice().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted small">Shipping</span>
              <span className="text-muted small">Calculated at checkout</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold">Total</span>
              <span className="fw-bold text-success fs-5">
                ₱{totalPrice().toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="btn btn-success w-100"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="btn btn-outline-secondary w-100 mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
