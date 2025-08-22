export default function informationToast(text: string, onClose: () => void) {
  return (
    <div
      className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
      role="alert"
      aria-labelledby="hs-toast-info-example-label"
    >
      <div className="flex p-6">
        <div className="shrink-0">
          <svg
            className="shrink-0 size-4 text-blue-500 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM8.93 6.588l-.588.01c-.324.01-.356.138-.356.356v4.09c0 .218.032.346.356.356l.588.01c.324.01.356-.138.356-.356V6.944c0-.218-.032-.346-.356-.356zM8 4.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
          </svg>
        </div>
        <div className="ms-2">
          <p className="text-sm text-gray-700 dark:text-neutral-400">{text}</p>
        </div>
        <div>
          <button
            onClick={() => onClose()}
            type="button"
            className="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-white"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
