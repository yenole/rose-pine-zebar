import { Circle, CloudLightningIcon, CloudMoonIcon, CloudMoonRainIcon, CloudRain, CloudRainWindIcon, CloudyIcon, Cpu, Dot, HeartPulse, MoonIcon, Music, Rocket, SnowflakeIcon, SunIcon, Wifi } from "lucide-react"
import { useMemo, useState } from "react";
import * as zebar from "zebar"
import { cn } from "./lib/utils";
import { format_time, getTraffic, getWindowTitle } from "./lib/glazewm";

const providers = zebar.createProviderGroup({
    network: { type: "network", refreshInterval: 2000 },
    glazewm: { type: "glazewm" },
    cpu: { type: "cpu" },
    date: { type: "date", formatting: "EEE d MMM t" },
    battery: { type: "battery" },
    memory: { type: "memory" },
    weather: { type: "weather" },
    audio: { type: 'audio' },
    media: { type: 'media' },
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

    const music = useMemo(() => output.media?.currentSession?.title || "", [output])
    const wifi: { value: number, unit: string } = useMemo(() => output.network && getTraffic(output.network) || { value: 0, unit: "MB" }, [output])

    const onWsClick = async (name: string) => {
        output.glazewm?.runCommand(`focus --workspace ${name}`)
    }

    return (
        <div className="flex flex-row justify-between w-full h-full text-sm px-3">
            <div className="flex items-center space-x-2">
                <div className="bg-[#483442] rounded-full  p-1 flex items-center" >
                    <HeartPulse className="flex items-center justify-center size-[16px] text-[#eb6f92]" />
                </div>
                <div className="bg-[#443a4a] rounded-full px-2 py-1 flex flex-row gap-x-2 items-center">
                    <Rocket className="flex items-center justify-center text-[#bda1de] size-[16px]" />
                    <span className="flex items-center justify-center text-[#bda1de] text-xs font-bold pr-2">
                        <span className="pr-1">{mem_usage}</span>GiB
                    </span>
                </div>
                <div className="bg-[#483c46] rounded-full px-2 py-1 flex flex-row gap-x-2 items-center">
                    <Cpu className="flex items-center justify-center text-[#eabbb9] size-[16px]" />
                    <span className="flex items-center justify-center text-[#eabbb9] text-xs font-bold pr-2">
                        <span className="pr-1">{cpu_usage}</span>%
                    </span>
                </div>
                <div className="bg-[#483c46] rounded-full px-1 py-1 flex flex-row gap-x-2 items-center">
                    {output.glazewm?.currentWorkspaces.map((v, i) =>
                        <Circle className={cn(Colors[i], "cursor-pointer size-[16px]", v.hasFocus ? "opacity-100" : "opacity-50")} strokeWidth={4} onClick={() => onWsClick(v.name)} />
                    )}
                </div>
            </div>
            <div className="fixed w-full z-[-1]  flex py-0.5 justify-center">
                {title && <div className="bg-[#342d38] p-1 rounded-full shadow-lg transition-[width] duration-1000 flex flex-row items-center space-x-2">
                    <Circle className={cn("flex items-center justify-center size-[16px]", Colors[focus])} strokeWidth={4} />
                    <span className="flex items-center justify-center text-xs text-white/70 pr-2 font-bold">{title}</span>
                </div>}
            </div>
            <div className="flex items-center space-x-2 ">
                {music && <div className="bg-[#483c46] rounded-full px-2 py-1 flex flex-row gap-x-2 items-center">
                    <Music className="flex items-center justify-center text-[#eabbb9] size-[16px]" />
                    <span className="text-[#eabbb9] text-xs font-bold pr-2">{music} </span>
                </div>}
                <div className="bg-[#483c46] rounded-full px-2 py-1 flex flex-row gap-x-2 items-center">
                    <Wifi className="flex items-center justify-center text-[#bda1de] size-[16px]" />
                    <span className="text-[#bda1de] text-xs font-bold pr-2">
                        <span className="pr-1">{wifi.value}</span>{wifi.unit}
                    </span>
                </div>
                <div className="bg-[#3A3532] px-2 py-1 rounded-full shadow-lg flex items-center">
                    <div className="flex items-center gap-x-2">
                        <Weather className="flex items-center justify-center text-[#e2b170] size-[16px]" />
                        <span className="flex items-center justify-center text-[#e2b170] text-xs font-bold">{celsius}°</span>
                    </div>
                    <Dot size="16" className="text-white/80" strokeWidth={5} />
                    <div className="flex flex-row gap-x-0.5 items-center">
                        <span className="flex items-center justify-center text-white/80 text-xs font-bold pr-2">{times}</span>
                    </div>
                </div>
            </div>
        </div >
    )
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
