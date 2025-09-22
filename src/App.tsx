import { Circle, CloudLightningIcon, CloudMoonIcon, CloudMoonRainIcon, CloudRain, CloudRainWindIcon, CloudyIcon, Cpu, Dot, HeartPulse, MoonIcon, Rocket, SnowflakeIcon, SunIcon } from "lucide-react"
import { useMemo, useState } from "react";
import * as zebar from "zebar"
import { cn } from "./lib/utils";
import { getWindowTitle } from "./lib/glazewm";

const providers = zebar.createProviderGroup({
    network: { type: "network" },
    glazewm: { type: "glazewm" },
    cpu: { type: "cpu" },
    date: { type: "date", formatting: "EEE d MMM t" },
    battery: { type: "battery" },
    memory: { type: "memory" },
    weather: { type: "weather" },
    audio: { type: 'audio' }
    // media: { type: 'media' },
});
const Colors = ['text-[#eb6f92]', "text-[#f6c177]", "text-[#e0b3b2]", "text-[#30748f]"]

function App() {
    const [output, setOutput] = useState(providers.outputMap);
    providers.onOutput((outputMap) => setOutput(outputMap));

    const cpu_usage = useMemo(() => (output.cpu?.usage || 0) >> 0, [output])
    const mem_usage = useMemo(() => (output.memory?.usedMemory || 0) / 1000000000 >> 0, [output])
    const celsius = useMemo(() => output.weather?.celsiusTemp || 0, [output])
    const Weather = useMemo(() => getWeatherIcon(output.weather?.status || "clear_day"), [output])

    const times = useMemo(() => format_time(output.date?.now || 0), [output])
    const focus = useMemo(() => output.glazewm?.currentWorkspaces.map(v => v.hasFocus).indexOf(true) || 0, [output])
    const title = useMemo(() => output.glazewm && getWindowTitle(output.glazewm) || "", [output])

    const onWsClick = async (name: string) => {
        output.glazewm?.runCommand(`focus --workspace ${name}`)
    }

    return (
        <div className="flex flex-row justify-between w-full h-full text-sm">
            <div className="bg-[#342d38] px-2 py-1 rounded-full shadow-lg flex items-center space-x-2">
                <div className="bg-[#483442] rounded-full  px-1 py-0.5 flex items-center" >
                    <HeartPulse className="flex items-center justify-center size-[18px] text-[#eb6f92]" />
                </div>
                <div className="bg-[#443a4a] rounded-full px-1 py-0.5 flex flex-row gap-x-2 items-center">
                    <Rocket className="flex items-center justify-center text-[#bda1de] size-[18px]" />
                    <span className="flex items-center justify-center text-[#bda1de] text-sm pr-2">{mem_usage}GiB</span>
                </div>
                <div className="bg-[#483c46] rounded-full px-1 py-0.5 flex flex-row gap-x-2 items-center">
                    <Cpu className="flex items-center justify-center text-[#eabbb9] size-[18px]" />
                    <span className="flex items-center justify-center text-[#eabbb9] text-sm pr-2">{cpu_usage}%</span>
                </div>
                {output.glazewm?.currentWorkspaces.map((v, i) =>
                    <Circle className={cn(Colors[i], "cursor-pointer", v.hasFocus ? "opacity-100" : "opacity-50")} strokeWidth={4} size="18" onClick={() => onWsClick(v.name)} />
                )}
            </div>
            {title && <div className="bg-[#342d38] px-2 py-1 rounded-full shadow-lg flex items-center space-x-2">
                <div className="bg-[#483c46] rounded-full px-1 py-0.5 flex flex-row gap-x-2 items-center">
                    <Circle className={cn("flex items-center justify-center size-[18px]", Colors[focus])} strokeWidth={4} />
                    <span className="flex items-center justify-center text-[#eabbb9] text-sm pr-2">{title}</span>
                </div>
            </div>}
            <div className="bg-[#3A3532] dark:bg-[#3A3532] px-2 py-1 rounded-full shadow-lg flex items-center">
                <div className="bg-[#493d3f] rounded-full px-1 py-0.5 flex flex-row gap-x-1 items-center">
                    <Weather className="flex items-center justify-center text-[#e2b170] size-[18]" />
                    <span className="flex items-center justify-center text-[#e2b170] text-sm pr-2">{celsius}°</span>
                </div>
                <Dot size="20" className="text-white/80" strokeWidth={5} />
                <div className="flex flex-row gap-x-0.5 items-center">
                    <span className="flex items-center justify-center text-white/80 text-sm">{times}</span>
                </div>
            </div>
        </div >
    )
}


function format_time(now: number) {
    const unix = new Date(now);
    return `${unix.getHours()}:${unix.getMinutes()}`
}
function getWeatherIcon(status: zebar.WeatherStatus) {
    switch (status) {
        case "snow_day":
        case "snow_night":
            return SnowflakeIcon;
        case "clear_day":
            return SunIcon;
        case "cloudy_day":
            return CloudyIcon;
        case "clear_night":
            return MoonIcon;
        case "thunder_day":
        case "thunder_night":
            return CloudLightningIcon;
        case "cloudy_night":
            return CloudMoonIcon;
        case "light_rain_day":
            return CloudRain;
        case "heavy_rain_day":
        case "heavy_rain_night":
            return CloudRainWindIcon;
        case "light_rain_night":
            return CloudMoonRainIcon;
    }
}
export default App
