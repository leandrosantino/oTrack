
export class Exception extends Error {

  public type: string

  constructor({ message, type }: { message: string, type: string }) {
    super(message, { cause: type })
    this.type = type
  }

  details() {
    return {
      message: this.message,
      type: this.type
    }
  }

  throw() { throw this }

}
