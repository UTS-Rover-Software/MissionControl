// Nav2TargetQueue.tsx

"use client"

import React, { useEffect, useMemo, useState } from "react"
import { ListOrdered, MapPin } from "lucide-react"

type RawQueueItem = [string, number, number]

type QueueMessage = {
  type: "queue"
  data: RawQueueItem[]
}

type PopMessage = {
  type: "pop"
}

type Nav2WsMessage = QueueMessage | PopMessage

export type Nav2Target = {
  name: string
  x: number
  y: number
}

interface Nav2TargetQueueProps {
  /** Optional explicit websocket URL. If omitted, will derive from window.location. */
  websocketUrl?: string
}

// ---------------------------------------------------------------------------
// URL HELPER
// ---------------------------------------------------------------------------

const getDefaultWebsocketUrl = (): string | null => {
  if (typeof window === "undefined") return null
  const protocol = window.location.protocol === "https:" ? "wss" : "ws"
  // tweak the path to match your backend route
  return `${protocol}://${window.location.host}/ws/nav2-targets`
}

// ---------------------------------------------------------------------------
// DEV / UI-TEST HELPERS (SAFE TO DELETE LATER)
// ---------------------------------------------------------------------------

/**
 * DEMO_QUEUE is ONLY for UI testing.
 * Delete this constant once the real websocket is wired and you no longer want
 * fake data.
 *
 * Six items here so the list overflows and you can test scrolling.
 */
const DEMO_QUEUE: Nav2Target[] = [
  { name: "Placard", x: 10, y: 10 },
  { name: "Yellow cube", x: 10, y: 15 },
  { name: "Placard II", x: 15, y: 15 },
  { name: "Blue cone", x: 18, y: 12 },
  { name: "Dock A", x: 20, y: 8 },
  { name: "Dock B", x: 22, y: 6 },
]

const Nav2TargetQueue: React.FC<Nav2TargetQueueProps> = ({
  websocketUrl,
}) => {
  const [queue, setQueue] = useState<Nav2Target[]>([])

  // -------------------------------------------------------------------------
  // DEV-ONLY SEEDING: prefill the queue so UI isn't empty.
  // TODO: Remove this effect once websocket backend is the only data source.
  // -------------------------------------------------------------------------
  useEffect(() => {
    setQueue((prev) => (prev.length === 0 ? DEMO_QUEUE : prev))
  }, [])

  // ---------------------------------------------------------------------------
  // WebSocket: keep local queue in sync with backend
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const url = websocketUrl ?? getDefaultWebsocketUrl()
    if (!url) return

    const ws = new WebSocket(url)

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: Nav2WsMessage = JSON.parse(event.data)

        if (msg.type === "queue") {
          const nextQueue: Nav2Target[] = msg.data.map(
            ([name, x, y]: RawQueueItem) => ({ name, x, y }),
          )
          setQueue(nextQueue)
        } else if (msg.type === "pop") {
          setQueue((prev) => prev.slice(1))
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse nav2 target queue message", err)
      }
    }

    ws.onerror = (event) => {
      // eslint-disable-next-line no-console
      console.error("Nav2 target queue websocket error", event)
    }

    return () => {
      ws.close()
    }
  }, [websocketUrl])

  const nextTarget = queue[0] ?? null

  const queueWithIndex = useMemo(
    () => queue.map((item, index) => ({ ...item, index })),
    [queue],
  )

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-full flex-col rounded-[10px] border-[2px] border-[#ACB3BD] bg-[#606975] text-[#f3f6fb]">
      {/* HEADER */}
      <div className="flex h-[59px] items-center justify-between px-[16px] pt-[16px] pb-0">
        {/* LEFT — TITLE PILL + NEXT TARGET */}
        <div className="flex items-center gap-[20px]">
          {/* TITLE PILL */}
          <div className="flex h-[43px] w-[188px] items-center justify-center rounded-[4px] bg-[#4F5865] px-[12px] py-[8px]">
            <span className="w-full text-center font-semibold text-[20px] uppercase text-white">
              TARGET QUEUE
            </span>
          </div>

          {/* NEXT TARGET SUMMARY */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#D2D8E2]">
              Next target
            </span>
            {nextTarget ? (
              <div className="flex items-center gap-[6px]">
                <span className="text-[14px] font-medium text-[#F3F6FB]">
                  {nextTarget.name}
                </span>
                <span className="flex items-center gap-[4px] text-[11px] text-[#D2D8E2]">
                  <MapPin className="h-[14px] w-[14px]" />
                  {nextTarget.x.toFixed(2)}, {nextTarget.y.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-[13px] text-[#9FA6B2]">
                Waiting for targets…
              </span>
            )}
          </div>
        </div>

        {/* RIGHT — COUNT BADGE + TEST BUTTONS */}
        <div className="flex items-center gap-[8px]">
          <ListOrdered className="h-[20px] w-[20px] text-[#D2D8E2]" />
          <span className="text-[13px] text-[#D2D8E2]">
            {queue.length} item{queue.length === 1 ? "" : "s"}
          </span>

          {/* ---------------------------------------------------------------- */}
          {/* TEST-ONLY CONTROLS: play with the queue in UI without backend.  */}
          {/* TODO: Delete this <div> when websocket-driven behaviour is the  */}
          {/* only source of truth.                                           */}
          {/* ---------------------------------------------------------------- */}
          <div className="ml-[12px] flex gap-[6px]">
            <button
              type="button"
              className="rounded-[4px] bg-[#4F5865] px-[8px] py-[4px] text-[11px] text-[#F3F6FB] hover:bg-[#5a6471]"
              onClick={() => setQueue(DEMO_QUEUE)}
            >
              Demo queue
            </button>
            <button
              type="button"
              className="rounded-[4px] bg-[#4F5865] px-[8px] py-[4px] text-[11px] text-[#F3F6FB] hover:bg-[#5a6471]"
              onClick={() =>
                setQueue((prev) => (prev.length ? prev.slice(1) : prev))
              }
            >
              Pop
            </button>
          </div>
        </div>
      </div>

      {/* BODY — SCROLLABLE QUEUE LIST */}
      <div className="mt-[12px] flex-1 overflow-y-auto px-[16px] pb-[16px]">
        {queueWithIndex.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-[6px] border-[2px] border-dashed border-[#4F5865] bg-[#525b68]/60 px-[16px] py-[12px] text-center text-[13px] text-[#D2D8E2]">
            No waypoints in the queue. Waiting for nav2 goals…
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {queueWithIndex.map((item) => {
              const isActive = item.index === 0
              return (
                <div
                  key={`${item.name}-${item.index}`}
                  className={`rounded-[6px] border-[2px] px-[16px] py-[12px] transition-colors ${
                    isActive
                      ? "border-[#F3F6FB] bg-[#4F5865]"
                      : "border-[#4F5865] bg-[#525b68]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[12px]">
                    {/* LEFT — INDEX + NAME */}
                    <div className="flex items-center gap-[12px]">
                      <div
                        className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border-[2px] border-[#ACB3BD] text-[13px] font-semibold ${
                          isActive ? "bg-[#606975]" : "bg-[#4F5865]"
                        }`}
                      >
                        {item.index + 1}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-white">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#D2D8E2]">
                          {isActive ? "Current nav2 goal" : "Queued waypoint"}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT — LOCATION */}
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] uppercase tracking-[0.08em] text-[#D2D8E2]">
                        Location
                      </span>
                      <span className="font-mono text-[13px] text-[#F3F6FB]">
                        {item.x.toFixed(2)}, {item.y.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Nav2TargetQueue
