// RosoutConsole.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Search, ChevronDown, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { jsPDF } from "jspdf"

// xterm
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"

type RosoutLog = {
  id: number
  timestamp: string
  level: LogLevel
  node: string
  message: string
}

// ---------------------------------------------------------------------------
// ANSI colour helpers for xterm so colours match your Figma palette
// ---------------------------------------------------------------------------

const ansiColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `\x1b[38;2;${r};${g};${b}m`
}

const RESET = "\x1b[0m"

const LEVEL_COLOR: Record<LogLevel, string> = {
  DEBUG: ansiColor("#7FB7FF"),
  INFO: ansiColor("#FFFFFF"),
  WARN: ansiColor("#FFB259"),
  ERROR: ansiColor("#FF6B6B"),
  FATAL: ansiColor("#F29CFF"),
}

const TS_COLOR = ansiColor("#E1E6F0")
const NODE_COLOR = ansiColor("#E1E6F0")

const RosoutConsole: React.FC = () => {
  const [logs, setLogs] = useState<RosoutLog[]>([])
  const [search, setSearch] = useState("")
  const [activeLevels, setActiveLevels] = useState<LogLevel[]>([
    "DEBUG",
    "INFO",
    "WARN",
    "ERROR",
    "FATAL",
  ])

  const terminalContainerRef = useRef<HTMLDivElement | null>(null)
  const termRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  const toggleLevel = (level: LogLevel) => {
    setActiveLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level],
    )
  }

  // -------------------------------------------------------------------------
  // Fake logs generator
  // -------------------------------------------------------------------------
  useEffect(() => {
    let idCounter = 0
    const levels: LogLevel[] = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
    const nodes = ["/camera", "/planner", "/drive_base", "/gps"]

    const interval = setInterval(() => {
      const level = levels[Math.floor(Math.random() * levels.length)]
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      const timestamp = new Date().toISOString().split("T")[1].slice(0, 8)

      const log: RosoutLog = {
        id: idCounter++,
        timestamp,
        level,
        node,
        message: `Simulated ${level} message from ${node}`,
      }

      setLogs((prev) => [...prev, log].slice(-500))
    }, 900)

    return () => clearInterval(interval)
  }, [])

  // -------------------------------------------------------------------------
  // Filtering for search + levels
  // -------------------------------------------------------------------------
  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return logs.filter((log) => {
      if (!activeLevels.includes(log.level)) return false
      if (!q) return true
      const haystack = `${log.message} ${log.node} ${log.level}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [logs, search, activeLevels])

  // -------------------------------------------------------------------------
  // xterm setup + write filtered logs into the terminal
  // -------------------------------------------------------------------------

  const formatLogLineForTerminal = (log: RosoutLog): string => {
    return (
      `${TS_COLOR}[${log.timestamp}]${RESET} ` +
      `${LEVEL_COLOR[log.level]}[${log.level}]${RESET} ` +
      `${NODE_COLOR}[${log.node}]${RESET} ` +
      `${log.message}`
    )
  }

  // create terminal once
  useEffect(() => {
    if (!terminalContainerRef.current) return

    const term = new Terminal({
      convertEol: true,
      fontFamily: "JetBrains Mono, Menlo, monospace",
      fontSize: 11,
      disableStdin: true,
      cursorBlink: false,
      scrollback: 2000,
      theme: {
        background: "#606975", // match widget background
        foreground: "#F3F6FB",
      },
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(terminalContainerRef.current)
    fitAddon.fit()

    termRef.current = term
    fitAddonRef.current = fitAddon

    const handleResize = () => fitAddon.fit()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      term.dispose()
    }
  }, [])

  // whenever filtered logs change, redraw terminal contents
  useEffect(() => {
    const term = termRef.current
    if (!term) return

    term.clear()
    filteredLogs.forEach((log) => {
      term.writeln(formatLogLineForTerminal(log))
    })
  }, [filteredLogs])

  // -------------------------------------------------------------------------
  // PDF export (same content as console, plain text)
  // -------------------------------------------------------------------------

  const formatLogLine = (log: RosoutLog): string => {
    return `[${log.timestamp}] [${log.level}] [${log.node}] ${log.message}`
  }

  const handleDownload = (): void => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    })

    doc.setFont("courier", "normal")
    doc.setFontSize(10)

    const leftMargin = 40
    const topMargin = 40
    const lineHeight = 14
    const maxWidth = 515 // A4 width minus margins
    const pageHeight = doc.internal.pageSize.getHeight()

    let y = topMargin

    filteredLogs.forEach((log) => {
      const fullLine = formatLogLine(log)
      const wrappedLines = doc.splitTextToSize(fullLine, maxWidth) as string[]

      wrappedLines.forEach((part) => {
        if (y + lineHeight > pageHeight - topMargin) {
          doc.addPage()
          y = topMargin
        }
        doc.text(part, leftMargin, y)
        y += lineHeight
      })
    })

    doc.save("rosout-logs.pdf")
  }

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------
  return (
    <div className="flex h-full flex-col rounded-[10px] border-[2px] border-[#ACB3BD] bg-[#606975] text-[#f3f6fb]">
      {/* HEADER */}
      <div className="flex h-[59px] items-center px-[16px] pt-[16px] pb-0">
        {/* LEFT — LOG CONSOLE + ALL TYPES */}
        <div className="flex items-center gap-[20px]">
          {/* LOG CONSOLE pill */}
          <div className="flex h-[43px] w-[168px] items-center justify-center rounded-[4px] bg-[#4F5865] px-[12px] py-[8px]">
            <span className="w-full text-center font-semibold text-[20px] uppercase text-white">
              LOG CONSOLE
            </span>
          </div>

          {/* ALL TYPES */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                style={{ backgroundColor: "rgba(172,179,189,0.5)" }}
                className="
                  flex h-[43px] min-w-[142px] items-center gap-[8px]
                  rounded-[4px]
                  px-[12px] py-[8px]
                  text-white shadow-none outline-none
                  hover:bg-[#ACB3BD]
                  cursor-pointer
                "
              >
                <span className="flex-1 text-left font-normal text-[20px]">
                  All types
                </span>
                <ChevronDown className="h-[28px] w-[28px]" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-40 border border-[#ACB3BD] bg-[#606975] text-[11px] text-[#f3f6fb]"
            >
              {(["DEBUG", "INFO", "WARN", "ERROR", "FATAL"] as LogLevel[]).map(
                (level) => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={activeLevels.includes(level)}
                    // keep menu open while clicking multiple
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={() => toggleLevel(level)}
                    className="cursor-pointer capitalize data-[state=checked]:bg-[#4F5865]"
                  >
                    {level.toLowerCase()}
                  </DropdownMenuCheckboxItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MIDDLE — SEARCH BAR CENTERED */}
        <div className="flex flex-1 justify-center">
          <div className="flex h-[43px] w-[253px] items-center gap-[12px] border-b-[2px] border-[#ACB3BD] pt-[12px] pb-[14px]">
            <Search className="h-[24px] w-[24px] text-[#D2D8E2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="w-full bg-transparent text-[14px] text-[#F3F6FB] placeholder:text-[#D2D8E2] outline-none"
            />
          </div>
        </div>

        {/* RIGHT — DOWNLOAD BUTTON */}
        <div className="flex items-center">
          <button
            type="button"
            style={{ backgroundColor: "rgba(172,179,189,0.5)" }}
            className="
              flex h-[43px] w-[43px] items-center justify-center
              rounded-[4px] p-[4px]
              hover:bg-[rgba(172,179,189,0.7)]
              cursor-pointer
            "
            onClick={handleDownload}
          >
            <Download className="h-[24px] w-[24px] text-black" />
          </button>
        </div>
      </div>

      {/* LOG AREA — xterm lives here */}
      <div className="mt-1 flex-1 overflow-y-auto px-[16px] pb-[16px] rosout-scroll">
        <div ref={terminalContainerRef} className="min-h-full w-full" />
      </div>
    </div>
  )
}

export default RosoutConsole