import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface AgentProps {
  userName: string;
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED;
  const isSpeaking = true;
  const messages = [
    "Whats your name ?",
    'My name is John Doe, nice to meet you buddy!'
  ];
  const lastMessage = messages[messages.length - 1];

  return (
    <div className="call-view flex flex-col items-center gap-8 p-4 md:p-8">

      {/* Cards Row */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* AI Interviewer Card */}
        <div className="card-interviewer flex-1 flex flex-col items-center gap-2 w-full">
          <div className="avatar relative w-16 h-16 md:w-20 md:h-20">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              fill
              className="object-cover rounded-full"
            />
            {isSpeaking && (
              <span className="animate-speak absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
            )}
          </div>
          <h3 className="text-white text-lg md:text-xl font-semibold">AI Interviewer</h3>
        </div>

        {/* User Card */}
        <div className="card-border flex-1 flex flex-col items-center justify-center text-center gap-2 w-full">
          <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h3 className="text-white text-lg md:text-xl font-semibold">{userName}</h3>
        </div>
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="transcript-border w-full max-w-4xl p-4">
          <div className="transcript">
            <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Call Button */}
      <div className="w-full max-w-4xl flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call px-6 py-2 md:px-8 md:py-3">
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span>
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                ? 'Call'
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect px-6 py-2 md:px-8 md:py-3">End</button>
        )}
      </div>
    </div>
  );
};

export default Agent;