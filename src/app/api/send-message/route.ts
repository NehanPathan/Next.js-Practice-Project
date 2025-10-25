import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { recipientUsername, content } = await request.json();
  try {
    // Find the recipient user
    const recipientUser = await UserModel.findOne({
      username: recipientUsername,
    });
    if (!recipientUser) {
      return Response.json(
        { success: false, message: "Recipient user not found" },
        { status: 404 }
      );
    }
    if (!recipientUser.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "Recipient is not accepting messages" },
        { status: 403 }
      );
    }
    // Create a new message
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    // Add the message to the recipient's messages array
    recipientUser.messages.push(newMessage as Message);
    await recipientUser.save();
    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}
