"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchemas";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      isAcceptingMessages:
        typeof window !== "undefined"
          ? localStorage.getItem("acceptMessages") === "true"
          : false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("isAcceptingMessages");

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      const value = res.data.isAcceptingMessages ?? false;
      setValue("isAcceptingMessages", value);
      localStorage.setItem("isAcceptingMessages", value.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data.message || "Error fetching status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      if (refresh) setIsLoading(true);
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(res.data.messages || []);
        if (refresh) toast.success("Messages refreshed");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError?.response?.data.message || "Error fetching messages"
        );
      } finally {
        if (refresh) setIsLoading(false);
      }
    },
    [setMessages]
  );

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptingMessages();
  }, [session, fetchMessages, fetchAcceptingMessages]);

  const handleSwitchChange = async () => {
    try {
      const newValue = !acceptMessages;
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        isAcceptingMessages: newValue,
      });
      setValue("isAcceptingMessages", newValue);
      localStorage.setItem("isAcceptingMessages", newValue.toString());
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data.message || "Error updating status"
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  // Show skeleton while session is loading
  if (status === "loading") {
    return (
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <div className="p-4">Please sign in to view your dashboard.</div>;
  }

  const username = session.user.username ?? "user";
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      {/* Copy Link Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-4 flex items-center">
        {isSwitchLoading ? (
          <Skeleton className="h-6 w-32 rounded" />
        ) : (
          <Switch
            {...register("isAcceptingMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
          />
        )}
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />

      {/* Refresh Messages Button */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* Messages Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-lg" />
          ))
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as React.Key}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
