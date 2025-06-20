import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface ICitizen extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  userType: "citizen";
  isVerified: boolean;
  avatar?: string;
  dateOfBirth?: Date;
  aadhaarNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const CitizenSchema = new Schema<ICitizen>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (phone: string) {
          return /^\d{10}$/.test(phone);
        },
        message: "Please enter a valid 10-digit phone number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    address: {
      street: String,
      city: String,
      state: { type: String, default: "Telangana" },
      pincode: {
        type: String,
        validate: {
          validator: function (pincode: string) {
            return !pincode || /^\d{6}$/.test(pincode);
          },
          message: "Please enter a valid 6-digit pincode",
        },
      },
    },
    userType: {
      type: String,
      default: "citizen",
      immutable: true, // Cannot be changed after creation
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    dateOfBirth: Date,
    aadhaarNumber: {
      type: String,
      validate: {
        validator: function (aadhaar: string) {
          return !aadhaar || /^\d{12}$/.test(aadhaar);
        },
        message: "Please enter a valid 12-digit Aadhaar number",
      },
    },
    emergencyContact: {
      name: String,
      phone: {
        type: String,
        validate: {
          validator: function (phone: string) {
            return !phone || /^\d{10}$/.test(phone);
          },
          message: "Please enter a valid 10-digit phone number",
        },
      },
      relation: String,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for faster queries
CitizenSchema.index({ email: 1 });
CitizenSchema.index({ phone: 1 });
CitizenSchema.index({ createdAt: -1 });

// Hash password before saving
CitizenSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
CitizenSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output
CitizenSchema.methods.toJSON = function () {
  const citizen = this.toObject();
  delete citizen.password;
  return citizen;
};

export default mongoose.models.Citizen ||
  mongoose.model<ICitizen>("Citizen", CitizenSchema);
