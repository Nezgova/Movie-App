import { render, screen } from "@testing-library/react";
import { AppContainer, PageContainer, Section } from "./Layout";

test("shared layout wrappers render with consistent structure", () => {
  render(
    <AppContainer>
      <PageContainer>
        <Section title="Trending" subtitle="Fresh picks" action={<button type="button">View all</button>}>
          <div>Content</div>
        </Section>
      </PageContainer>
    </AppContainer>
  );

  expect(screen.getByText("Trending")).toBeInTheDocument();
  expect(document.querySelector(".app-container")).toBeInTheDocument();
  expect(document.querySelector(".page-container")).toBeInTheDocument();
  expect(document.querySelector(".section-block")).toBeInTheDocument();
});
