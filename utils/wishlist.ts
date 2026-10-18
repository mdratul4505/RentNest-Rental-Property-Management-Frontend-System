export interface WishlistProperty {
  id: string;
  title: string;
  description?: string;
  location: string;
  price: number;
  category?: {
    name?: string;
  };
  amenities?: string[];
  rating?: number | string;
  createdAt?: string;
  savedAt?: string;
}

export function getActiveUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rentnest_user_id");
}

export function setActiveUserId(userId: string | null) {
  if (typeof window === "undefined") return;
  if (userId) {
    localStorage.setItem("rentnest_user_id", userId);
  } else {
    localStorage.removeItem("rentnest_user_id");
  }
}

export function getStorageKey(userId?: string | null): string {
  const effectiveId = userId || getActiveUserId();
  return effectiveId ? `rentnest_wishlist_${effectiveId}` : "rentnest_wishlist_guest";
}

export function getWishlist(userId?: string | null): WishlistProperty[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    let items: WishlistProperty[] = raw ? JSON.parse(raw) : [];

    // Auto-migrate guest items if logged-in user's list is currently empty
    const effectiveId = userId || getActiveUserId();
    if (effectiveId && items.length === 0) {
      const guestRaw = localStorage.getItem("rentnest_wishlist_guest") || localStorage.getItem("rentnest_wishlist");
      if (guestRaw) {
        try {
          const guestItems: WishlistProperty[] = JSON.parse(guestRaw);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            items = guestItems;
            localStorage.setItem(key, JSON.stringify(items));
            localStorage.removeItem("rentnest_wishlist_guest");
            localStorage.removeItem("rentnest_wishlist");
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    return Array.isArray(items) ? items : [];
  } catch (e) {
    console.error("Failed to read wishlist from localStorage", e);
    return [];
  }
}

export function isInWishlist(propertyId: string, userId?: string | null): boolean {
  const items = getWishlist(userId);
  return items.some((item) => item.id === propertyId);
}

export function saveToWishlist(property: WishlistProperty, userId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  try {
    const items = getWishlist(userId);
    if (!items.some((item) => item.id === property.id)) {
      const updated = [
        {
          ...property,
          savedAt: new Date().toISOString(),
        },
        ...items,
      ];
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { propertyId: property.id, action: "added", count: updated.length },
        })
      );
      return true;
    }
    return false;
  } catch (e) {
    console.error("Failed to save to wishlist", e);
    return false;
  }
}

export function removeFromWishlist(propertyId: string, userId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  try {
    const items = getWishlist(userId);
    const updated = items.filter((item) => item.id !== propertyId);
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("wishlistUpdated", {
        detail: { propertyId, action: "removed", count: updated.length },
      })
    );
    return true;
  } catch (e) {
    console.error("Failed to remove from wishlist", e);
    return false;
  }
}

export function toggleWishlistItem(property: WishlistProperty, userId?: string | null): boolean {
  if (isInWishlist(property.id, userId)) {
    removeFromWishlist(property.id, userId);
    return false;
  } else {
    saveToWishlist(property, userId);
    return true;
  }
}

export function clearWishlist(userId?: string | null) {
  if (typeof window === "undefined") return;
  const key = getStorageKey(userId);
  localStorage.removeItem(key);
  window.dispatchEvent(
    new CustomEvent("wishlistUpdated", {
      detail: { action: "cleared", count: 0 },
    })
  );
}
