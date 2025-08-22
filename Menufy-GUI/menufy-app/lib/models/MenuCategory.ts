import { MenuItem } from "./MenuItem"

export interface MenuCategory {
  id: string
  name: string
  image: string | null
  items: MenuItem[] | []
}