'use client';

// ...existing imports...
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelSubscriptionPage() {
  const router = useRouter();

  // Step state: 0 = initial, 1 = congrats/questions, 2 = downsell offer
  const [step, setStep] = useState(0);

  // Form state for step 1
  const [foundWithMM, setFoundWithMM] = useState<string | null>(null);
  const [rolesApplied, setRolesApplied] = useState<string | null>(null);
  const [companiesEmailed, setCompaniesEmailed] = useState<string | null>(null);
  const [companiesInterviewed, setCompaniesInterviewed] = useState<string | null>(null);

  // add new state (place near other useState declarations)
  const [visaProvided, setVisaProvided] = useState<string | null>(null);
  const [visaType, setVisaType] = useState<string>('');
  // feedback for new popup (step 3)
  const [feedbackText, setFeedbackText] = useState('');

  // Step 12 survey selections
  const [step12Q1, setStep12Q1] = useState<string | null>(null);
  const [step12Q2, setStep12Q2] = useState<string | null>(null);
  const [step12Q3, setStep12Q3] = useState<string | null>(null);
  // Step 13 reason selection
  const [step13Reason, setStep13Reason] = useState<string | null>(null);
  const [step13Error, setStep13Error] = useState<string | null>(null);
  const [step13MaxPay, setStep13MaxPay] = useState<string>('');
  const [step13PlatformFeedback, setStep13PlatformFeedback] = useState("")
  const [step13Notenoughrelevantjobs, stepStep13Notenoughrelevantjobs] = useState("")
  const [step13Decidednottomove, stepStep13Decidednottomove] = useState("")
  const [step13Other, stepStep13Other] = useState("")



  const allAnswered =
    foundWithMM !== null &&
    rolesApplied !== null &&
    companiesEmailed !== null &&
    companiesInterviewed !== null;

  const handleClose = () => {
    router.push('/');
  };

  // Step 0: Ask if found a job
  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            &times;
          </button>
          <h1 className="text-1xl font-bold text-center mb-6">
            Subscription Cancellation
          </h1>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-left order-2 md:order-1">
              <p className="text-lg font-medium">Hey mate,</p>
              <p className="text-lg font-medium mb-2">Quick one before you go.</p>
              <p className="text-lg font-medium mb-4">Have you found a job yet?</p>
              <p className="text-gray-600 mb-6">
                Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Yes, I've found a job
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Not yet - I'm still looking
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center order-1 md:order-2 mt-6 md:mt-0 md:ml-6">
              <Image
                src="/empire-state-compressed.jpg"
                alt="Job illustration"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 13: Reasons for cancelling (shown after Continue from Step 12)
  if (step === 13) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button onClick={() => setStep(12)} className="text-gray-500 hover:text-gray-700 text-lg font-medium mr-4">&larr; Back</button>
            <div className="flex-1 text-center text-sm text-gray-500 font-medium">Subscription Cancellation</div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
          </div>

          <div className="p-8 flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-extrabold mb-4">What’s the main reason for cancelling?</h2>
              <p className="text-gray-600 mb-4">Please take a minute to let us know why:</p>

              <div className="space-y-4">
                {step13Error && (
                  <div className="text-sm text-red-600 mb-2">{step13Error}</div>
                )}

                {[
                  'Too expensive',
                  'Platform not helpful',
                  'Not enough relevant jobs',
                  'Decided not to move',
                  'Other'
                ].map(reason => (
                  <label key={reason} className="flex items-center gap-3">
                    <input type="radio" name="cancelReason" checked={step13Reason === reason} onChange={() => { setStep13Reason(reason); setStep13Error(null); if (reason !== 'Too expensive') setStep13MaxPay(''); }} className="h-4 w-4" />
                    <span className="text-gray-800">{reason}</span>
                  </label>
                ))}

                {step13Reason === 'Too expensive' && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-600 block mb-2">What would be the maximum you would be willing to pay?*</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-white text-gray-600">$</span>
                      <input
                        type="text"
                        value={step13MaxPay}
                        onChange={(e) => { setStep13MaxPay(e.target.value); setStep13Error(null); }}
                        placeholder=""
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none"
                      />
                    </div>
                  </div>
                )}
                {step13Reason === "Platform not helpful" && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-600 block mb-2">
                      What can we change to make the platform more helpful?*
                    </label>
                    {step13PlatformFeedback.length < 25 && (
                      <div className="text-sm text-red-600 mb-2">
                        Please enter at least 25 characters so we can understand your feedback*
                      </div>
                    )}
                    <textarea
                      value={step13PlatformFeedback}
                      onChange={(e) => {
                        setStep13PlatformFeedback(e.target.value)
                        setStep13Error(null)
                      }}
                      placeholder=""
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Min 25 characters ({step13PlatformFeedback.length}/25)
                    </div>
                  </div>
                )}
                {step13Reason === "Not enough relevant jobs" && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-600 block mb-2">
                      What can we change to make the platform more helpful?*
                    </label>
                    {step13PlatformFeedback.length < 25}
                    <textarea
                      value={step13Notenoughrelevantjobs}
                      onChange={(e) => {
                        stepStep13Notenoughrelevantjobs(e.target.value)
                        setStep13Error(null)
                      }}
                      placeholder=""
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Min 25 characters ({step13Notenoughrelevantjobs.length}/25)
                    </div>
                  </div>
                )}
                {step13Reason === "Decided not to move" && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-600 block mb-2">
                      What can we change to make the platform more helpful?*
                    </label>
                    {step13PlatformFeedback.length < 25}
                    <textarea
                      value={step13Decidednottomove}
                      onChange={(e) => {
                        stepStep13Decidednottomove(e.target.value)
                        setStep13Error(null)
                      }}
                      placeholder=""
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Min 25 characters ({step13Decidednottomove.length}/25)
                    </div>
                  </div>
                )}
                {step13Reason === "Other" && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-600 block mb-2">
                      What can we change to make the platform more helpful?*
                    </label>
                    {step13PlatformFeedback.length < 25}
                    <textarea
                      value={step13Other}
                      onChange={(e) => {
                        stepStep13Other(e.target.value)
                        setStep13Error(null)
                      }}
                      placeholder=""
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Min 25 characters ({step13Other.length}/25)
                    </div>
                  </div>
                )}
              </div>

              <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

              <button className="w-full py-3 rounded-full bg-[#21B573] text-white font-semibold text-lg hover:bg-[#1fa866] mb-3" onClick={() => setStep(11)}>Get 50% off | $12.50 <span className="text-xs text-gray-200 line-through ml-2">$25</span></button>

              <button
                onClick={() => {
                  if (!step13Reason) {
                    setStep13Error('To help us understand your experience, please select a reason for cancelling*');
                    return;
                  }
                  if (step13Reason === 'Too expensive' && !step13MaxPay.trim()) {
                    setStep13Error('Please enter the maximum amount you would be willing to pay.');
                    return;
                  }
                  // If the user selected "Platform not helpful", navigate to a dedicated feedback page
                  // if (step13Reason === 'Platform not helpful') {
                  //   router.push('/platform-not-helpful');
                  //   return;
                  // }
                  setStep(14);
                }}
                className={`w-full py-3 rounded-lg font-semibold ${step13Reason ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-200 text-gray-700'}`}
              >
                Complete cancellation
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image src="/empire-state-compressed.jpg" alt="Job illustration" width={600} height={520} className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Congrats/questions (already implemented)
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-0 relative overflow-hidden">
         
          {/* Progress Bar/Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setStep(0)}
              className="text-gray-500 hover:text-gray-700 text-lg font-medium mr-4"
            >
              &larr; Back
            </button>
            <h1 className="text-1xl font-bold text-center mb-6">
            Subscription Cancellation
          </h1>
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          
           {/* X Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
        >
          &times;
        </button></div>
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Form */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-2"> Congrats on the new role! <span aria-label="party" role="img">🎉</span></h2>
              <div className="space-y-6 mt-6">
                {/* Q1 */}
                <div>
                  <label className="block font-medium mb-2">Did you find this job with MigrateMate?*</label>

                  {/* make each button take ~1/4 of the popup width */}
                  <div className="flex justify-center gap-4">
                    <button
                      className={`w-full px-4 py-2 rounded-lg border ${foundWithMM === 'yes' ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'} font-medium w-[25vw] min-w-[120px]`}
                      onClick={() => setFoundWithMM('yes')}
                    >
                      Yes
                    </button>

                    <button
                      className={`w-full px-4 py-2 rounded-lg border ${foundWithMM === 'no' ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'} font-medium w-[25vw] min-w-[120px]`}
                      onClick={() => setFoundWithMM('no')}
                    >
                      No
                    </button>
                  </div>
                </div>
                {/* Q2 */}
                <div>
                  <label className="block font-medium mb-2">How many roles did you <span className="underline">apply</span> for through Migrate Mate?*</label>
                  <div className="flex gap-4">
                    {['0', '1-5', '6-20', '20+'].map(val => (
                      <button
                        key={val}
                        className={`w-full flex-1 px-2 py-2 rounded-lg border ${rolesApplied === val ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'} font-medium`}
                        onClick={() => setRolesApplied(val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Q3 */}
                <div>
                  <label className="block font-medium mb-2">How many companies did you <span className="underline">email</span> directly?*</label>
                  <div className="flex gap-4">
                    {['0', '1-5', '6-20', '20+'].map(val => (
                      <button
                        key={val}
                        className={`w-full flex-1 px-2 py-2 rounded-lg border ${companiesEmailed === val ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'} font-medium`}
                        onClick={() => setCompaniesEmailed(val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Q4 */}
                <div>
                  <label className="block font-medium mb-2">How many different companies did you <span className="underline">interview</span> with?*</label>
                  <div className="flex gap-4">
                    {['0', '1-2', '3-5', '5+'].map(val => (
                      <button
                        key={val}
                        className={`w-full flex-1 px-2 py-2 rounded-lg border ${companiesInterviewed === val ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'} font-medium`}
                        onClick={() => setCompaniesInterviewed(val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                {/* divider + spacing between options and Continue button */}
                <div className="my-6">
                  <div className="h-px bg-gray-200 rounded" />
                </div>
              </div>
              {/* Continue now opens the feedback popup (step 3) */}
              <button
                className={`mt-8 w-full py-3 rounded-lg font-semibold text-white transition ${allAnswered ? 'bg-[#8952fc] hover:bg-[#7b40fc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                disabled={!allAnswered}
                onClick={() => { if (allAnswered) setStep(3); }}
              >
                Continue
              </button>
            </div>
            {/* Right: Image */}
            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image
                src="/empire-state-compressed.jpg"
                alt="Job illustration"
                width={350}
                height={350}
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Downsell offer for "Not yet - I'm still looking"
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-0 relative overflow-hidden">
          {/* Progress Bar/Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setStep(0)}
              className="text-gray-500 hover:text-gray-700 text-lg font-medium mr-4"
            >
              &larr; Back
            </button>
            <h1 className="text-1xl font-bold text-center mb-6">
            Subscription Cancellation
          </h1>
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          
           {/* X Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
        >
          &times;
        </button></div>

          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Offer */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-2 leading-tight text-gray-900">
                We built this to help you land the job, this makes it a little easier.
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                We’ve been there and we’re here to help you.
              </p>

              {/* Discount card (styled to match screenshot colors) */}
              <div className="rounded-xl p-6 mb-6 border-2"
                   style={{ backgroundColor: '#f6fff5ff', borderColor: '#e6d8ff' }}>
                <div className="text-center mb-3">
                  <div className="text-2xl font-extrabold text-[#3b235f]">
                    Here’s <span className="text-[#8952fc]">50% off</span> until you find a job.
                  </div>
                </div>

                <div className="flex items-baseline justify-center gap-3 mb-4">
                  <span className="text-2xl font-extrabold text-[#8952fc]">$12.50</span>
                  <span className="text-sm text-[#8952fc]">/month</span>
                  <span className="text-sm text-gray-400 line-through ml-3">$25/month</span>
                </div>

                <button
                className="w-full py-3 rounded-full bg-[#21B573] text-white font-semibold text-lg hover:bg-[#1fa866] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21B573] transition-shadow shadow-sm"
                onClick={() => setStep(11)}
              >
                Get 50% off
              </button>

                <div className="text-xs text-gray-500 text-center mt-3">
                  You won’t be charged until your next billing date.
                </div>
              </div>

              <button
                  className="w-full  px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition "
                      onClick={() => setStep(12)}
                    >
                      No thanks
                    </button>
            </div>
            

            {/* Right: Image */}
            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image
                src="/empire-state-compressed.jpg"
                alt="Job illustration"
                width={350}
                height={350}
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Step 3: Feedback popup shown after Continue from step 1
  if (step === 3) {
    const chars = feedbackText.trim().length;
    const min = 25;
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
              &larr; Back
            </button>

            <div className="flex-1 flex justify-center">
              <span className="text-sm text-gray-500 font-medium">Subscription Cancellation</span>
            </div>

            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10" aria-label="Close">
              &times;
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Feedback form */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                What’s one thing you wish we could’ve helped you with?
              </h2>
              <p className="text-gray-700 mb-4">
                We’re always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
              </p>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-40 md:h-56 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8952fc]"
                placeholder="Tell us..."
              />

              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">Min 25 characters ({chars}/{min})</div>
              </div>

              <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

              {/* IMPORTANT: choose next popup based on foundWithMM */}
              <button
                disabled={chars < min}
                onClick={() => { if (chars >= min) setStep(foundWithMM === 'yes' ? 5 : 4); }}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${chars >= min ? 'bg-[#8952fc] hover:bg-[#7b40fc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Continue
              </button>
            </div>

            {/* Right: Illustration */}
            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image src="/empire-state-compressed.jpg" alt="Job illustration" width={420} height={420} className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Post-feedback popup for users who answered "No" to FoundWithMM
  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">&larr; Back</button>
            <div className="flex-1 flex justify-center">
              <span className="text-sm text-gray-500 font-medium">Subscription Cancellation</span>
            </div>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10">&times;</button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-extrabold mb-4">You landed the job! <span className="italic font-medium">That’s what we live for.</span></h2>
              <p className="text-gray-700 mb-6">Even if it wasn’t through MigrateMate, let us help get your visa sorted.</p>

              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Is your company providing an immigration lawyer to help with your visa?*</div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="visa" checked={visaProvided === 'yes'} onChange={() => setVisaProvided('yes')} className="h-4 w-4" />
                    <span className="text-gray-800">Yes</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="visa" checked={visaProvided === 'no'} onChange={() => setVisaProvided('no')} className="h-4 w-4" />
                    <span className="text-gray-800">No</span>
                  </label>
                </div>
              </div>

              <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

              <button
                disabled={!visaProvided}
                onClick={() => {
                  // route to the same final confirmation popups as steps 6/7
                  if (visaProvided === 'yes') {
                    setStep(6);
                  } else {
                    setStep(7);
                  }
                }}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${visaProvided ? 'bg-[#8952fc] hover:bg-[#7b40fc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Complete cancellation
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image src="/empire-state-compressed.jpg" alt="Job illustration" width={420} height={420} className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Post-feedback popup for users who answered "Yes" to FoundWithMM
  if (step === 5) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">&larr; Back</button>
            <div className="flex-1 flex justify-center">
              <span className="text-sm text-gray-500 font-medium">Subscription Cancellation</span>
            </div>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10">&times;</button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-extrabold mb-4">We helped you land the job, now let’s help you secure your visa.</h2>
              <p className="text-gray-700 mb-6">Is your company providing an immigration lawyer to help with your visa?*</p>

              <div className="mb-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="visa2" checked={visaProvided === 'yes'} onChange={() => setVisaProvided('yes')} className="h-4 w-4" />
                    <span className="text-gray-800">Yes</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="visa2" checked={visaProvided === 'no'} onChange={() => setVisaProvided('no')} className="h-4 w-4" />
                    <span className="text-gray-800">No</span>
                  </label>
                </div>
              </div>

              <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

              <button
                // enable as soon as a radio is selected (visaType NOT required here)
                disabled={!visaProvided}
                onClick={() => {
                  if (visaProvided === 'yes') {
                    setStep(6);
                  } else {
                    setStep(7);
                  }
                }}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${visaProvided ? 'bg-[#8952fc] hover:bg-[#7b40fc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Complete cancellation
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image src="/empire-state-compressed.jpg" alt="Job illustration" width={420} height={420} className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Post-feedback popup for users who answered "Yes" to asking visa type
  if (step === 6) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">&larr; Back</button>
            <div className="flex-1 flex justify-center">
              <span className="text-sm text-gray-500 font-medium">Subscription Cancellation</span>
            </div>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10">&times;</button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-extrabold mb-4">You landed the job! <span className="italic font-medium">That’s what we live for.</span></h2>
              <p className="text-gray-700 mb-6">Is your company providing an immigration lawyer to help with your visa?*</p>

              <div className="mb-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="visa2_confirm" checked={visaProvided === 'yes'} onChange={() => setVisaProvided('yes')} className="h-4 w-4" />
                    <span className="text-gray-800">Yes</span>
                  </label>
                  {/* <label className="flex items-center gap-3">
                    <input type="radio" name="visa2_confirm" checked={visaProvided === 'no'} onChange={() => setVisaProvided('no')} className="h-4 w-4" />
                    <span className="text-gray-800">No</span>
                  </label> */}
                </div>
              </div>

              {/* visaType input moved here (Step 6) */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-2">Which visa will you be applying for?</label>
                <input
                  type="text"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  placeholder="Enter visa type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8952fc]"
                />
              </div>

              <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

              <button
                disabled={!visaProvided}
                onClick={() => {
                  // show final processed popup (step 9) instead of closing immediately
                  if (visaProvided) setStep(9);
                }}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${visaProvided ? 'bg-[#8952fc] hover:bg-[#7b40fc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Complete cancellation
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image
                src="/empire-state-compressed.jpg"
                alt="Job illustration"
                width={420}
                height={420}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Step 7: Post-feedback popup for users who answered "No" connecting trusted partners for visa help
  if (step === 7) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <button onClick={() => setStep(3)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">&larr; Back</button>
            <div className="flex-1 flex justify-center">
              <span className="text-sm text-gray-500 font-medium">Subscription Cancellation</span>
            </div>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10">&times;</button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-extrabold mb-4">You landed the job! <span className="italic font-medium">That’s what we live for.</span></h2>
              <p className="text-gray-700 mb-6">Is your company providing an immigration lawyer to help with your visa?*</p>

              <div className="mb-6">
                <div className="space-y-3">
                  {/* <label className="flex items-center gap-3">
                    <input type="radio" name="visa2_confirm" checked={visaProvided === 'yes'} onChange={() => setVisaProvided('yes')} className="h-4 w-4" />
                    <span className="text-gray-800">Yes</span>
                  </label> */}
                  <label className="flex items-center gap-3">
                    <input type="radio" name="visa2_confirm" checked={visaProvided === 'no'} onChange={() => setVisaProvided('no')} className="h-4 w-4" />
                    <span className="text-gray-800">No</span>
                  </label>
                </div>
              </div>

              {/* visaType input moved here (Step 6) */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-2">We can connect you with one of our trusted partners.</label>
                <label className="text-sm text-gray-600 block mb-2">Which visa will you be applying for?</label>
                <input
                  type="text"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  placeholder="Enter visa type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8952fc]"
                />
              </div>

              <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

              <button
                disabled={!visaProvided}
                onClick={() => { /* open final partner/connect popup (step 10) */ setStep(10); }}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${visaProvided ? 'bg-[#8952fc] hover:bg-[#7b40fc]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Complete cancellation
              </button>
            </div>

            <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
              <Image
                src="/empire-state-compressed.jpg"
                alt="Job illustration"
                width={420}
                height={420}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 10: Final popup after completing cancellation from Step 7 (partners / contact card)
  if (step === 10) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-8 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div />
            <div className="text-sm text-gray-500">Subscription Cancelled</div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
          </div>

          <div className="mt-6 md:flex md:items-start md:gap-6">
            <div className="md:flex-1">
              <h3 className="text-3xl font-extrabold">Your cancellation’s all sorted, mate, no more charges.</h3>

              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4 max-w-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image src="/mihailo-profile.jpeg" alt="avatar" width={48} height={48} className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">Mihailo Bozic</div>
                      <div className="text-xs text-gray-500">&lt;mihailo@migratemate.co&gt;</div>
                  </div>
                </div>

                <div className="mt-4 text-gray-700 text-sm space-y-2">
                  <p>I’ll be reaching out soon to help with the visa side of things.</p>
                  <p>We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.</p>
                  <p>Keep an eye on your inbox, I’ll be in touch shortly.</p>
                </div>
              </div>

              <div className="mt-6">
                <button onClick={handleClose} className="w-full px-6 py-3 rounded-lg bg-[#8952fc] text-white font-semibold hover:bg-[#7b40fc]">Finish</button>
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <Image src="/empire-state-compressed.jpg" alt="illustration" width={640} height={420} className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 9: Final processed popup after completing cancellation from Step 6
  if (step === 9) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-8 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div />
            <div className="text-sm text-gray-500">Subscription Cancelled</div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
          </div>

          <div className="mt-6 md:flex md:items-center md:gap-6">
            <div className="md:flex-1">
              <h3 className="text-3xl font-extrabold">All done, your cancellation’s been processed.</h3>
              <p className="text-gray-700 mt-3">We’re stoked to hear you’ve landed a job and sorted your visa. Big congrats from the team. 🙌</p>
              <div className="mt-6">
                <button onClick={handleClose} className="px-6 py-3 rounded-lg bg-[#8952fc] text-white font-semibold hover:bg-[#7b40fc]">Finish</button>
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <Image src="/empire-state-compressed.jpg" alt="illustration" width={640} height={420} className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 11: Offer accepted modal (shown after clicking Get 50% off)
  if (step === 11) {
          return (
            <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-6xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
                <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div />
                  <div className="flex-1 text-center text-sm text-gray-500 font-medium">Subscription</div>
                  <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="md:flex-1">
                    <h2 className="text-3xl font-extrabold mb-3">Great choice, mate!</h2>
                    <p className="text-lg text-gray-700 mb-4">You're still on the path to your dream role. <span className="text-[#8952fc] font-semibold">Let's make it happen together!</span></p>

                    <p className="text-sm text-gray-500 mb-6">You've got XX days left on your current plan. Starting from XX date, your monthly payment will be $12.50.</p>

                    <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

                    <button className="w-full md:w-1/2 py-3 rounded-full bg-[#8952fc] text-white font-semibold hover:bg-[#7b40fc]">Land your dream role</button>
                  </div>

                  <div className="md:w-1/3">
                    <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                      <Image src="/empire-state-compressed.jpg" alt="illustration" width={800} height={520} className="object-cover w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Step 12: Offer declined -> survey modal (shown after clicking No thanks in Step 2)
        if (step === 12) {
          return (
            <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-6xl mx-4 sm:mx-0 rounded-lg shadow-lg p-0 relative overflow-hidden">
                <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700 text-lg font-medium mr-4">&larr; Back</button>
                  <div className="flex-1 text-center text-sm text-gray-500 font-medium">Subscription Cancellation</div>
                  <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-8 flex flex-col md:flex-row items-stretch">
                  <div className="md:w-1/2">
                    <h2 className="text-3xl font-extrabold mb-4">Help us understand how you were using Migrate Mate.</h2>

                    {/* Q1 */}
                    <div className="mb-6">
                      <label className="block font-medium mb-2">How many roles did you apply for through Migrate Mate?</label>
                      <div className="flex gap-4">
                        {['0','1-5','6-20','20+'].map(v => (
                          <button
                            key={v}
                            onClick={() => setStep12Q1(v)}
                            className={`flex-1 px-3 py-2 rounded-lg border font-medium ${step12Q1 === v ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                          >{v}</button>
                        ))}
                      </div>
                    </div>

                    {/* Q2 */}
                    <div className="mb-6">
                      <label className="block font-medium mb-2">How many companies did you email directly?</label>
                      <div className="flex gap-4">
                        {['0','1-5','6-20','20+'].map(v => (
                          <button
                            key={v}
                            onClick={() => setStep12Q2(v)}
                            className={`flex-1 px-3 py-2 rounded-lg border font-medium ${step12Q2 === v ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                          >{v}</button>
                        ))}
                      </div>
                    </div>

                    {/* Q3 */}
                    <div className="mb-6">
                      <label className="block font-medium mb-2">How many different companies did you interview with?</label>
                      <div className="flex gap-4">
                        {['0','1-2','3-5','5+'].map(v => (
                          <button
                            key={v}
                            onClick={() => setStep12Q3(v)}
                            className={`flex-1 px-3 py-2 rounded-lg border font-medium ${step12Q3 === v ? 'bg-[#ece9fd] border-[#8952fc] text-[#8952fc]' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                          >{v}</button>
                        ))}
                      </div>
                    </div>

                    <div className="my-6"><div className="h-px bg-gray-200 rounded" /></div>

                    <button className="w-full py-3 rounded-full bg-[#21B573] text-white font-semibold text-lg hover:bg-[#1fa866] mb-3" onClick={() => setStep(11)}>Get 50% off | $12.50 <span className="text-xs text-gray-200 line-through ml-2">$25</span></button>

                    <button
                      disabled={!(step12Q1 && step12Q2 && step12Q3)}
                      onClick={() => { if (step12Q1 && step12Q2 && step12Q3) { setStep(13); } }}
                      className={`w-full py-3 rounded-lg font-semibold ${step12Q1 && step12Q2 && step12Q3 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-600'}`}
                    >
                      Continue
                    </button>
                  </div>

                  <div className="md:w-1/2 flex justify-center items-center bg-gray-100 p-8">
                    <Image src="/empire-state-compressed.jpg" alt="Job illustration" width={600} height={520} className="object-cover rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          );
        }
          // Step 14: Final processed popup after completing cancellation from Step 13
  if (step === 14) {
    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl mx-4 sm:mx-0 rounded-lg shadow-lg p-8 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div />
            <div className="text-sm text-gray-500">Subscription Cancelled</div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
          </div>

          <div className="mt-6 md:flex md:items-center md:gap-6">
            <div className="md:flex-1">
              <h3 className="text-3xl font-extrabold">Sorry to see you go, mate.</h3>
              <h3 className="text-3xl font-extrabold">Thanks for being with us, and you’re always welcome back.</h3>
              <p className="text-gray-700 mt-3">Your subscription is set to end on XX date.</p>
              <p>You’ll still have full access until then. No further charges after that.</p>
              <div className="mt-6">
                <button onClick={handleClose} className="px-6 py-3 rounded-lg bg-[#8952fc] text-white font-semibold hover:bg-[#7b40fc]">Back to Jobs</button>
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <Image src="/empire-state-compressed.jpg" alt="illustration" width={640} height={420} className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}