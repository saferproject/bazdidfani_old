import { Button } from "@mui/material";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  // Changes whenever the route changes; used to clear a stale error so the
  // fallback does not stay on screen after navigating to another page.
  resetKey?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: ErrorInfo | null;
  renderedKey?: string;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    info: null,
    renderedKey: this.props.resetKey,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    // The route changed: drop any captured error so the new page renders
    // instead of the previous page's error fallback.
    if (props.resetKey !== state.renderedKey)
      return { error: null, info: null, renderedKey: props.resetKey };

    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the full error visible in the console for debugging.
    console.error("ErrorBoundary caught an error:", error, info);
    this.setState({ info });
  }

  private handleReset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    const { error, info } = this.state;

    if (!error) return this.props.children;

    return (
      <div
        dir="rtl"
        className="flex w-full flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <h2 className="text-xl font-bold text-red-600">
          خطایی در نمایش این صفحه رخ داد
        </h2>
        <p className="text-gray-600">
          صفحه را دوباره بارگذاری کنید. اگر مشکل ادامه داشت متن خطای زیر را برای
          پشتیبانی ارسال کنید.
        </p>
        <pre
          dir="ltr"
          className="max-h-64 w-full max-w-3xl overflow-auto rounded-lg bg-gray-900 p-4 text-left text-xs text-red-300"
        >
          {error.message}
          {info?.componentStack ?? error.stack ?? ""}
        </pre>
        <div className="flex gap-2">
          <Button variant="contained" onClick={this.handleReset}>
            تلاش دوباره
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            بارگذاری مجدد صفحه
          </Button>
        </div>
      </div>
    );
  }
}
