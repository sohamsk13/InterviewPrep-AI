"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';



enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface AgentProps {
  userName: string;
}

interface SavedMessage {
  role : 'user' | 'system' | 'assistant' ;
  content : string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {

  const router = useRouter();

  const [isSpeaking,setIsSpeaking] =  useState(false);

  const [callStatus,setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  const [messages,setMessages ] = useState<SavedMessage[]>([])
   
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
     const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

     const onMessage = (message : Message) => {
        if(message.type === 'transcript' && message.transcriptType === 'final' )
        {
            const newMessage = {role: message.role,content : message.transcript}

            setMessages((prev)=> [...prev,newMessage]);
        }
     }

     const onSpeechStart = () => setIsSpeaking(true);

     const onSpeechEnd = () => setIsSpeaking(false);

     const onError = (error:Error) => console.log('Error',error);

     vapi.on('call-start',onCallStart);
     vapi.on('call-end',onCallEnd);
     vapi.on('message',onMessage);
     vapi.on('speech-start',onSpeechEnd);
     vapi.on('speech-end',onSpeechEnd);
     vapi.on('error',onError);

    return () => {
      vapi.off('call-start',onCallStart);
      vapi.off('call-end',onCallEnd);
      vapi.off('message',onMessage);
      vapi.off('speech-start',onSpeechEnd);
      vapi.off('speech-end',onSpeechEnd);
      vapi.off('error',onError);
    }


  },[])

  const handleGenerateFeedback = async (messages : SavedMessage[] ) => {
      console.log('Generate feedback here .');

      const {success , feedbackId: id} = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages
      })

     if(success && id) {
      router.push(`/interview/${interviewId}/feedback`);
     }
     else {
       console.log('Error Saving Feedback');
       router.push('/');
     }

  }

  useEffect(()=> {

   if(callStatus === CallStatus.FINISHED){
     if(type === 'generate'){
       router.push('/')
     }
     else {
          handleGenerateFeedback(messages);
     }
   }


  },[messages,callStatus,type,userId])

  const handleCall = async() => {
     setCallStatus(CallStatus.CONNECTING);

     if(type === 'generate') {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues : {
           username : userName,
           userid: userId,
        }
      })
     }

     else {
      let formattedQuestions = '';
        
       if(questions) {
        formattedQuestions = questions.map((question:any) => `- ${question} ` )
        .join('\n');
       }

       await vapi.start(interviewer, {
        variableValues: {
          questions : formattedQuestions
        }
       })

     }

    
  }

  const handleDisconnect = async() => {
    setCallStatus(CallStatus.FINISHED);

    vapi.stop();
  }

  const latestMessage = messages[messages.length-1]?.content;

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;



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
            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      {/* Call Button */}
      <div className="w-full max-w-4xl flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call px-6 py-2 md:px-8 md:py-3" onClick={handleCall} >
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span>
              {isCallInactiveOrFinished ? 'Call' : '. . .'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect px-6 py-2 md:px-8 md:py-3" onClick={handleDisconnect} >End</button>
        )}
      </div>
    </div>
  );
};

export default Agent;