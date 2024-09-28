import ErrorSVG from './ErrorSVG.tsx'

interface ErrorMessageProps {
  code: number;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ code, message }) => (
  <div className="flex flex-col items-center justify-center text-center text-white">
    <ErrorSVG code={code}/>
    <h2 className="text-4xl font-serif mt-6">{code} Error</h2>
    <p className="text-lg mt-4">{message}</p>
  </div>
)

export default ErrorMessage
