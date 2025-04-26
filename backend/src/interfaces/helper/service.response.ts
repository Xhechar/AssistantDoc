import { ServiceResponse } from "../assist.doc.interfaces";

export class FormattedResponse {
  static success<T>(message: string, object?: T, objects?: T[]): ServiceResponse<T> {
    return {
      success: true,
      message,
      error: null,
      object: object ?? null,
      objects: objects ?? null
    };
  }

  static failure<T>(message: string, error: string): ServiceResponse<T> {
    return {
      success: false,
      message,
      error,
      object: null,
      objects: null
    };
  }

  static auth<T>(token: string, role: string): ServiceResponse<T> {
    return {
      success: true,
      message: "Authentication successful",
      error: null,
      object: null,
      token,
      role
    };
  }
}
