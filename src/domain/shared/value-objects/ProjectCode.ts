import { nanoid } from "nanoid";

/**
 * ProjectCode Value Object
 * Represents a unique Buffalo Project identifier (BUF-XXXX format)
 * Immutable and self-validating
 */
export class ProjectCode {
  private constructor(private readonly _value: string) {
    this.validate();
  }

  static generate(): ProjectCode {
    // Generate 4-character alphanumeric code (only A-Z and 0-9)
    const code = nanoid(4)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "0"); // Replace non-alphanumeric with 0

    // Ensure it's exactly 4 characters
    const safeCode = (code + "0000").substring(0, 4);
    return new ProjectCode(`BUF-${safeCode}`);
  }

  static fromString(value: string): ProjectCode {
    return new ProjectCode(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProjectCode): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private validate(): void {
    // Must start with BUF-
    if (!this._value.startsWith("BUF-")) {
      throw new Error("Invalid project code format: must start with BUF-");
    }

    // Must match pattern BUF-XXXX (at least 4 characters after prefix)
    const pattern = /^BUF-[A-Z0-9]{4,}$/;
    if (!pattern.test(this._value)) {
      throw new Error(
        "Invalid project code format: must be BUF- followed by at least 4 alphanumeric characters",
      );
    }
  }
}
