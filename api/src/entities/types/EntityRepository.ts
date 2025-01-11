export interface EntityRepository<Entity, Id> {
  exists(id: Id): Promise<boolean>
  getById(id: Id): Promise<Entity | null>
  findMany(): Promise<Entity[]>
}
