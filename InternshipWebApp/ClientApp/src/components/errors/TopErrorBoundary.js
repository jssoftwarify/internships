import React from "react";
import ErrorBoundary from "./ErrorBoundary";

export default class TopErrorBoundary extends ErrorBoundary {
  render() {
    if (this.state.hasError) {
      return (
        <details>
          <summary>Více informací</summary>
          {this.state.errorInfo &&
            this.state.errorInfo.componentStack.toString()}
        </details>
      );
    }
    return this.props.children;
  }
}
