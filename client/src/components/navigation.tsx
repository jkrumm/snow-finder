import { Button, Navbar } from "@blueprintjs/core";
import {getPathTitle, path, Paths, usePath} from "../hooks/use-path.ts";
import { useSignals } from "@preact/signals-react/runtime";

export const Navigation = () => {
    useSignals();

    const { navigate } = usePath();

    return ( <Navbar className="!shadow-none border-t-1 md:border-t-0 md:border-b-1 border-[#404854]">
        <Navbar.Group className="justify-evenly !float-none">
            <Navbar.Heading
                onClick={() => navigate(Paths.HOME)}
            >
                SnowFinder
            </Navbar.Heading>
            <Navbar.Divider />
            <Button
                className="bp5-minimal"
                icon="home"
                text={getPathTitle(Paths.HOME)}
                active={path.value === Paths.HOME}
                onClick={() => navigate(Paths.HOME)}
            />
            <Button
                className="bp5-minimal"
                icon="snowflake"
                text={getPathTitle(Paths.WEATHER)}
                active={path.value === Paths.WEATHER}
                onClick={() => navigate(Paths.WEATHER)}
            />
            <Button
                className="bp5-minimal"
                icon="map"
                text={getPathTitle(Paths.MAP)}
                active={path.value === Paths.MAP}
                onClick={() => navigate(Paths.MAP)}
            />
            <Button
                className="bp5-minimal"
                icon="star"
                text={getPathTitle(Paths.FAVORITES)}
                active={path.value === Paths.FAVORITES}
                onClick={() => navigate(Paths.FAVORITES)}
            />
            <Button
                className="bp5-minimal"
                icon="cog"
                text={getPathTitle(Paths.SETTINGS)}
                active={path.value === Paths.SETTINGS}
                onClick={() => navigate(Paths.SETTINGS)}
            />
        </Navbar.Group>
    </Navbar>)
}