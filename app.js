const classroom = document.getElementById("classroom");
const groupView = document.getElementById("groupView");
const backBtn = document.getElementById("backBtn");
const modeLabel = document.getElementById("modeLabel");

const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const startNum = document.getElementById("startNum");
const endNum = document.getElementById("endNum");
const groupSize = document.getElementById("groupSize");

let dragSeat = null;
let isGroupMode = false;

document.getElementById("createBtn").onclick = () => {
  exitGroupMode();
  createSeats();
};
document.getElementById("shuffleBtn").onclick = () => {
  exitGroupMode();
  shuffleSeats();
};
document.getElementById("groupBtn").onclick = makeGroups;
backBtn.onclick = exitGroupMode;

// 그룹 색상 팔레트
const groupColors = [
  {
    bg: "rgba(255,107,107,0.25)",
    border: "rgba(255,107,107,0.5)",
    title: "#ff6b6b",
  },
  {
    bg: "rgba(255,217,61,0.25)",
    border: "rgba(255,217,61,0.5)",
    title: "#ffd93d",
  },
  {
    bg: "rgba(107,203,119,0.25)",
    border: "rgba(107,203,119,0.5)",
    title: "#6bcb77",
  },
  {
    bg: "rgba(77,150,255,0.25)",
    border: "rgba(77,150,255,0.5)",
    title: "#4d96ff",
  },
  {
    bg: "rgba(247,127,0,0.25)",
    border: "rgba(247,127,0,0.5)",
    title: "#f77f00",
  },
  {
    bg: "rgba(155,93,229,0.25)",
    border: "rgba(155,93,229,0.5)",
    title: "#9b5de5",
  },
  {
    bg: "rgba(0,187,249,0.25)",
    border: "rgba(0,187,249,0.5)",
    title: "#00bbf9",
  },
  {
    bg: "rgba(241,91,181,0.25)",
    border: "rgba(241,91,181,0.5)",
    title: "#f15bb5",
  },
];

function createSeats() {
  const rows = Number(rowsInput.value);
  const cols = Number(colsInput.value);
  const start = Number(startNum.value);
  const end = Number(endNum.value);

  classroom.innerHTML = "";
  classroom.style.gridTemplateColumns = `repeat(${cols}, 65px)`;

  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);

  for (let i = 0; i < rows * cols; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = nums[i] ?? "";
    seat.draggable = true;
    seat.style.animationDelay = `${i * 0.025}s`;

    seat.addEventListener("dragstart", () => {
      dragSeat = seat;
      seat.classList.add("dragging");
    });
    seat.addEventListener("dragend", () => seat.classList.remove("dragging"));
    seat.addEventListener("dragover", (e) => e.preventDefault());
    seat.addEventListener("drop", () => {
      if (dragSeat && dragSeat !== seat) {
        const temp = seat.textContent;
        seat.textContent = dragSeat.textContent;
        dragSeat.textContent = temp;
      }
    });
    classroom.appendChild(seat);
  }
}

function shuffleSeats() {
  const seats = [...document.querySelectorAll(".seat")];
  const nums = seats.map((s) => s.textContent).filter((n) => n !== "");
  nums.sort(() => Math.random() - 0.5);
  let i = 0;
  seats.forEach((seat) => {
    if (seat.textContent !== "") seat.textContent = nums[i++];
    seat.classList.remove("group");
    seat.style.animationName = "none";
    requestAnimationFrame(() => {
      seat.style.animationName = "";
      seat.style.animationDelay = `${Math.random() * 0.2}s`;
    });
  });
}

function makeGroups() {
  const size = Math.max(2, Number(groupSize.value));
  const seats = [...document.querySelectorAll(".seat")];
  const nums = seats.map((s) => s.textContent).filter((n) => n !== "");

  if (nums.length === 0) return;

  // 현재 번호 셔플
  const shuffled = [...nums].sort(() => Math.random() - 0.5);

  // 그룹 나누기
  const groups = [];
  for (let i = 0; i < shuffled.length; i += size) {
    groups.push(shuffled.slice(i, i + size));
  }

  // 그룹 뷰 렌더
  groupView.innerHTML = "";
  groups.forEach((members, gi) => {
    const col = groupColors[gi % groupColors.length];

    const card = document.createElement("div");
    card.className = "group-card";
    card.style.background = col.bg;
    card.style.borderColor = col.border;
    card.style.animationDelay = `${gi * 0.08}s`;

    const title = document.createElement("div");
    title.className = "group-title";
    title.style.color = col.title;
    title.textContent = `${gi + 1}모둠`;
    card.appendChild(title);

    // 그리드 열 수: ceil(sqrt(size)) 정도
    const cols = Math.ceil(Math.sqrt(members.length));
    const grid = document.createElement("div");
    grid.className = "group-seats";
    grid.style.gridTemplateColumns = `repeat(${cols}, 58px)`;

    members.forEach((num, mi) => {
      const s = document.createElement("div");
      s.className = "group-seat";
      s.textContent = num;
      s.style.animationDelay = `${gi * 0.08 + mi * 0.05}s`;
      s.draggable = true;
      s.style.cursor = "grab";
      s.addEventListener("dragstart", () => {
        dragSeat = s;
        s.style.opacity = "0.4";
      });
      s.addEventListener("dragend", () => {
        s.style.opacity = "1";
      });
      s.addEventListener("dragover", (e) => e.preventDefault());
      s.addEventListener("drop", () => {
        if (dragSeat && dragSeat !== s) {
          const temp = s.textContent;
          s.textContent = dragSeat.textContent;
          dragSeat.textContent = temp;
        }
      });
      grid.appendChild(s);
    });

    card.appendChild(grid);
    groupView.appendChild(card);
  });

  // 뷰 전환
  isGroupMode = true;
  classroom.style.display = "none";
  groupView.classList.add("active");
  backBtn.classList.add("active");
  modeLabel.textContent = `총 ${nums.length}명 → ${groups.length}개 모둠 (모둠당 최대 ${size}명)`;
  modeLabel.classList.add("active");
}

function exitGroupMode() {
  isGroupMode = false;
  classroom.style.display = "grid";
  groupView.classList.remove("active");
  backBtn.classList.remove("active");
  modeLabel.classList.remove("active");
}

createSeats();
