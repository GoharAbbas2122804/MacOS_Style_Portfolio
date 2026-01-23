import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, User, RotateCcw, PenSquare } from "lucide-react";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { useContact } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Mail() {
  const { mutate, isPending } = useContact();
  const [activeFolder, setActiveFolder] = useState("inbox");
  
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertMessage) => {
    mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="flex h-full bg-white text-black divide-x divide-gray-200">
      {/* Sidebar */}
      <div className="w-48 bg-[#f5f5f5] flex flex-col pt-4 pb-4">
        <div className="px-4 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase">Favorites</p>
        </div>
        <button 
          onClick={() => setActiveFolder("inbox")}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm ${activeFolder === 'inbox' ? 'bg-[#dcdcdc]' : 'hover:bg-[#e8e8e8]'}`}
        >
          <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white text-[10px]">1</div>
          <span>Inbox</span>
        </button>
        <button 
          onClick={() => setActiveFolder("sent")}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm ${activeFolder === 'sent' ? 'bg-[#dcdcdc]' : 'hover:bg-[#e8e8e8]'}`}
        >
          <Send className="w-4 h-4 text-gray-500" />
          <span>Sent</span>
        </button>
        <button 
          onClick={() => setActiveFolder("drafts")}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm ${activeFolder === 'drafts' ? 'bg-[#dcdcdc]' : 'hover:bg-[#e8e8e8]'}`}
        >
          <PenSquare className="w-4 h-4 text-gray-500" />
          <span>Drafts</span>
        </button>
      </div>

      {/* Message List (Dummy) */}
      <div className="w-64 bg-white flex flex-col border-r border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500">Today</p>
        </div>
        <div className="p-3 bg-blue-500 text-white">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-sm">Gohar Abbas</span>
            <span className="text-xs opacity-80">10:42 AM</span>
          </div>
          <p className="text-sm font-medium">New Message</p>
          <p className="text-xs opacity-80 truncate">Contact me for web development...</p>
        </div>
      </div>

      {/* Compose Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-[#f9f9f9]">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" onClick={() => form.reset()}>
              <RotateCcw className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
          <Button 
            disabled={isPending} 
            onClick={form.handleSubmit(onSubmit)}
            className="bg-transparent hover:bg-transparent p-0 text-gray-400 hover:text-blue-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-8 flex-1 overflow-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                <span className="text-gray-400 w-12 text-right text-sm">To:</span>
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  <User className="w-3 h-3" />
                  <span>gohar@example.com</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                <span className="text-gray-400 w-12 text-right text-sm">From:</span>
                <Input 
                  {...form.register("name")}
                  placeholder="Your Name" 
                  className="border-none shadow-none focus-visible:ring-0 px-0 h-auto font-medium" 
                />
              </div>

              <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                <span className="text-gray-400 w-12 text-right text-sm">Email:</span>
                <Input 
                  {...form.register("email")}
                  placeholder="your@email.com" 
                  className="border-none shadow-none focus-visible:ring-0 px-0 h-auto" 
                />
              </div>
            </div>

            <Textarea 
              {...form.register("message")}
              placeholder="Write your message..." 
              className="min-h-[300px] border-none shadow-none focus-visible:ring-0 resize-none text-base p-0" 
            />
          </form>
        </div>
      </div>
    </div>
  );
}
