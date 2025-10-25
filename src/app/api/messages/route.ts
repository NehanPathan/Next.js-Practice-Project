import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/schemas/messageSchemas";
import { z } from "zod";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json(
      { success: false, message: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Sort messages by createdAt (latest first)
    const sortedMessages = [...user.messages].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return Response.json(
      { success: true, data: sortedMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Error fetching messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // ✅ Validate message content with Zod
    const parseResult = messageSchema.safeParse({ content: body.content });
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0].message;
      return Response.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { recipientUsername, content } = body;

    if (!recipientUsername) {
      return Response.json(
        { success: false, message: "Recipient username is required" },
        { status: 400 }
      );
    }

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

    // Add the message to the recipient's messages array
    recipientUser.messages.push({ content, createdAt: new Date() });

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
