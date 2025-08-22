export interface PersistedCartItem {
  i: string
  q: number
}

export class CartStorageManager {
  private static instance: CartStorageManager
  private readonly storageKey: string
  private hasLoadedFromStorage: boolean = false

  private constructor() {
    this.storageKey = process.env.CART_STORAGE_KEY || 'menufy_cart_items'
  }

  /**
   * Get singleton instance of CartStorageManager
   */
  public static getInstance(): CartStorageManager {
    if (!CartStorageManager.instance) {
      CartStorageManager.instance = new CartStorageManager()
    }
    return CartStorageManager.instance
  }

  /**
   * Save cart items to localStorage
   * @param items - Array of persisted cart items to save
   * @param skipInitialLoadCheck - Skip the initial load check (useful for clearing cart)
   */
  public saveCartToStorage(items: PersistedCartItem[], skipInitialLoadCheck: boolean = false): void {
    if (!skipInitialLoadCheck && !this.hasLoadedFromStorage) {
      return // Don't save during initial load
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  /**
   * Load cart items from localStorage
   * @returns Array of persisted cart items
   */
  public loadCartFromStorage(): PersistedCartItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      console.log("Stored cart items:", stored)
      
      // Always mark as loaded after first attempt, regardless of whether data exists
      this.hasLoadedFromStorage = true
      
      if (!stored) return []

      const persistedItems: PersistedCartItem[] = JSON.parse(stored)
      if (!Array.isArray(persistedItems)) return []

      // Filter out invalid items
      return persistedItems.filter(item => 
        item && 
        typeof item.i === 'string' && 
        typeof item.q === 'number' && 
        item.q > 0
      )
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      // Still mark as loaded even on error to allow future saves
      this.hasLoadedFromStorage = true
      return []
    }
  }

  /**
   * Clear cart from localStorage
   */
  public clearCartFromStorage(): void {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error)
    }
  }

  /**
   * Check if cart has been loaded from storage
   */
  public getHasLoadedFromStorage(): boolean {
    return this.hasLoadedFromStorage
  }

  /**
   * Set the loaded from storage flag (useful for testing or manual control)
   */
  public setHasLoadedFromStorage(value: boolean): void {
    this.hasLoadedFromStorage = value
  }

  /**
   * Get the storage key being used
   */
  public getStorageKey(): string {
    return this.storageKey
  }

}

// Export a default instance for convenience
export const cartStorageManager = CartStorageManager.getInstance()
