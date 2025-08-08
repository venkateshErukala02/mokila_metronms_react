import React from "react";

export default function SubwayMap() {
  return (
    <div className="flex justify-center mt-10">
      <svg width="700" height="500" viewBox="0 0 700 500">
        {/* Yellow Subway Line Path */}
        <path
          d="M100,50 L200,150 L200,220 L300,300 L380,360 L380,420 C380,430 390,440 400,440"
          stroke="#facc15" strokeWidth="10" fill="none" strokeLinecap="round"
        />

        {/* Stations (red circles) and labels */}
        {[
          { name: "Highway 407", x: 100, y: 50 },
          { name: "Vaughan Metropolitan Centre", x: 130, y: 80 },
          { name: "Pioneer Village", x: 160, y: 110 },
          { name: "York University", x: 190, y: 140 },
          { name: "Downsview Park", x: 200, y: 170 },
          { name: "Wilson", x: 200, y: 190 },
          { name: "Lawrence West", x: 200, y: 210 },
          { name: "Eglinton West", x: 220, y: 230 },
          { name: "Sheppard West", x: 240, y: 250 },
          { name: "Yorkdale", x: 260, y: 270 },
          { name: "Glencairn", x: 280, y: 290 },
          { name: "St. Clair West", x: 300, y: 310 },
          { name: "Dupont", x: 320, y: 330 },
          { name: "Spadina", x: 340, y: 350 },
          { name: "St. George", x: 360, y: 370 },
          { name: "Museum", x: 380, y: 390 },
          { name: "Queen’s Park", x: 380, y: 410 },
          { name: "St. Patrick", x: 380, y: 430 },
          { name: "Osgoode", x: 390, y: 450 },
          { name: "St. Andrew", x: 395, y: 460 },
          { name: "Union", x: 400, y: 480 },
        ].map((station, index) => (
          <g key={index}>
            <circle cx={station.x} cy={station.y} r="5" fill="darkred" />
            <text x={station.x + 10} y={station.y} fontSize="12" alignmentBaseline="middle">
              {station.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
