import mongoose, { Schema } from "mongoose";
import { Password } from "../service/password";

interface userAttrs {
  email: string;
  password: string;
}
const userSchema = new Schema<userAttrs>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret._v;
      },
    },
  }
);
// userSchema.pre("save", async function (done) {
//   if (this.isModified("password")) {
//     const hashed = await Password.toHash(this.get("password"));
//     this.set("password", hashed);
//   }
// });

const User = mongoose.model<userAttrs>("User", userSchema);

export { User };
