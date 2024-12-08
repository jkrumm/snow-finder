import { Button, Navbar } from "@blueprintjs/core";
import { useSignals } from "@preact/signals-react/runtime";
import { currentView, Views } from "../state/navigation.state.ts";

export function Navigation() {
  useSignals();

  return (
    <Navbar className="!shadow-none border-t-1 md:border-t-0 md:border-b-1 border-[#404854]">
      <Navbar.Group className="justify-evenly !float-none">
        <Navbar.Heading
          className="hidden sm:inline"
          onClick={() => currentView.value = Views.WEATHER}
        >
          SnowFinder
        </Navbar.Heading>
        <Navbar.Divider className="hidden sm:inline" />
        <Button
          className="bp5-minimal"
          icon="menu"
          text={Views.LIST}
          active={currentView.value === Views.LIST}
          onClick={() => currentView.value = Views.LIST}
        />
        <Button
          className="bp5-minimal"
          icon="snowflake"
          text={Views.WEATHER}
          active={currentView.value === Views.WEATHER}
          onClick={() => currentView.value = Views.WEATHER}
        />
        <Button
          className="bp5-minimal"
          icon="map"
          text={Views.MAP}
          active={currentView.value === Views.MAP}
          onClick={() => currentView.value = Views.MAP}
        />
        <Button
          className="bp5-minimal"
          icon="star"
          text={Views.FAVORITES}
          active={currentView.value === Views.FAVORITES}
          onClick={() => currentView.value = Views.FAVORITES}
        />
      </Navbar.Group>
    </Navbar>
  );
}
