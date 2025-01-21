import QueryWrapper from "./QueryWrapper";
import ReduxWrapper from "./ReduxWrapper";
import RouteWrapper from "./RouteWrapper";
import ThemeWrapper from "./ThemeWrapper";

function App() {
  return (
    <div>
      <ReduxWrapper>
        <QueryWrapper>
          <ThemeWrapper>
            <RouteWrapper />
          </ThemeWrapper>
        </QueryWrapper>
      </ReduxWrapper>
    </div>
  );
}

export default App;
