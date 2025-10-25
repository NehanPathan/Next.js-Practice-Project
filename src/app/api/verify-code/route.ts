import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchemas";

const VerifyQuerySchema = z.object({
  code: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    console.log("Received verification request:");
    console.log("username:", username);
    console.log("code:", code);

    if (!username) {
      console.warn("Username is missing in the request!");
      return Response.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(username);
    console.log("Decoded username:", decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log("User found in DB:", user);

    if (!user) {
      console.warn("No user found with this username.");
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 } // changed from 500 to 404
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();
    console.log(
      "isCodeValid:",
      isCodeValid,
      "isCodeNotExpired:",
      isCodeNotExpired
    );

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      console.log("User verified successfully:", user.username);

      return Response.json(
        { success: true, message: "User verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      console.warn("Invalid verification code for user:", user.username);
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    } else {
      console.warn("Verification code expired for user:", user.username);
      return Response.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during user verification:", error);
    return Response.json(
      {
        success: false,
        message: "Error during user verification",
      },
      { status: 500 }
    );
  }
}
