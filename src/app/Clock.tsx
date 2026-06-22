"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type ClockTime = {
  digital: string;
  date: string;
  hourAngle: number;
  minuteAngle: number;
};

function getClockTime(): ClockTime {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return {
    digital: now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: now.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
    hourAngle: (hours % 12) * 30 + minutes * 0.5,
    minuteAngle: minutes * 6 + seconds * 0.1,
  };
}

const numberPositions: React.CSSProperties[] = [
  { left: "50%", top: "11%" },
  { left: "69.5%", top: "16.2%" },
  { left: "83.8%", top: "30.5%" },
  { left: "89%", top: "50%" },
  { left: "83.8%", top: "69.5%" },
  { left: "69.5%", top: "83.8%" },
  { left: "50%", top: "89%" },
  { left: "30.5%", top: "83.8%" },
  { left: "16.2%", top: "69.5%" },
  { left: "11%", top: "50%" },
  { left: "16.2%", top: "30.5%" },
  { left: "30.5%", top: "16.2%" },
];

export default function Clock() {
  const [time, setTime] = useState<ClockTime | null>(null);

  useEffect(() => {
    const firstTick = window.setTimeout(() => setTime(getClockTime()), 0);
    const timer = window.setInterval(() => {
      setTime(getClockTime());
    }, 1000);

    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(timer);
    };
  }, []);

  const hourMarks = useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);
  const visibleTime = time ?? {
    digital: "--:--:--",
    date: "시간을 준비하고 있어요",
    hourAngle: 0,
    minuteAngle: 0,
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-label="아날로그 시계">
        <div className={styles.header}>
          <p className={styles.eyebrow}>KII02 Clock</p>
          <h1>시침과 분침이 있는 시계</h1>
          <p className={styles.description}>현재 시간을 부드럽게 따라가는 간단한 아날로그 시계예요.</p>
        </div>

        <div className={styles.clockWrap}>
          <div className={styles.clockFace} role="img" aria-label={`현재 시간 ${visibleTime.digital}`}>
            {hourMarks.map((mark) => {
              const number = mark === 0 ? 12 : mark;
              return (
                <span className={styles.number} key={number} style={numberPositions[mark]}>
                  {number}
                </span>
              );
            })}

            <span className={styles.tickTop} />
            <span className={styles.tickRight} />
            <span className={styles.tickBottom} />
            <span className={styles.tickLeft} />

            <div
              className={`${styles.hand} ${styles.hourHand}`}
              style={{ transform: `translateX(-50%) rotate(${visibleTime.hourAngle}deg)` }}
            />
            <div
              className={`${styles.hand} ${styles.minuteHand}`}
              style={{ transform: `translateX(-50%) rotate(${visibleTime.minuteAngle}deg)` }}
            />
            <div className={styles.centerDot} />
          </div>
        </div>

        <div className={styles.footer}>
          <strong>{visibleTime.digital}</strong>
          <span>{visibleTime.date}</span>
        </div>
      </section>
    </main>
  );
}
