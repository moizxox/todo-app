let addTaskBtn = document.getElementById("addBtn");
let taskList = document.querySelector(".task-list");
let form = document.querySelector("#inputForm");
let newTaskTitle;
let taskKey;
let searchForm = document.querySelector("#searchForm #searchTask");
let searchString = "";
let isSearching = false;

searchForm.addEventListener("input", (e) => {
  e.preventDefault();
  searchString = searchForm.value;
  if (searchString !== "") {
    isSearching = true;
  }
  taskList.innerHTML = "";
  if (isSearching) {
    searchData(searchString);
  } else {
    addBoxes();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let taskInput = document.querySelector("#addTaskInput").value;
  let taskStatus = false;
  if (taskInput !== "") {
    let taskInputData = {
      inputTaskTitle: taskInput,
      inputTaskStatus: taskStatus,
      inputTaskPrior: "low",
    };
    localStorage.setItem(Date.now(), JSON.stringify(taskInputData));
    taskList.innerHTML = "";
    addBoxes();
    form.reset();
  } else {
    let emptyMsg = document.querySelector(".empty-msg");
    emptyMsg.classList.remove("hidden");
    setTimeout(() => {
      emptyMsg.classList.add("hidden");
    }, 1000);
  }
  taskList.innerHTML = "";
  if (isSearching) {
    searchData(searchString);
  } else {
    addBoxes();
  }
});

let addBoxes = () => {
  // console.log("helo");

  for (let i = 0; i < localStorage.length; i++) {
    newTaskTitle = localStorage.getItem(localStorage.key(i));
    taskKey = localStorage.key(i);
    // console.log(taskKey, JSON.parse(newTaskTitle).inputTaskPrior);

    addTask(
      JSON.parse(newTaskTitle).inputTaskTitle,
      taskKey,
      JSON.parse(newTaskTitle).inputTaskStatus,
      JSON.parse(newTaskTitle).inputTaskPrior
    );
  }

  editTask();
  deleteTask();
  checkTask();
  sortBox();
  prioSelection();
};

let addTask = (taskTitle, key, status, prior) => {
  const btnText = status === "true" ? "Not Complete" : "Complete";
  const uniqueName = `priority-${key}`; // Unique name for each task

  const isHighChecked = prior === "high" ? "checked" : "";
  const isMediumChecked = prior === "medium" ? "checked" : "";
  const isLowChecked = prior === "low" ? "checked" : "";

  const taskBox = `<div
  class="task-box p-[10px] bg-white rounded-[10px] flex flex-col gap-y-[10px]"
  data-key="${key}"
  data-status="${status}"
  data-prior="${prior}"
>
  <input
    id="taskTitle"
    type="text"
    value="${taskTitle}"
    class="w-full bg-transparent outline-none font-medium"
    disabled
  />
  <div class="task-btns">
    <button
      class="bg-blue-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 hover:bg-blue-600 text-white uppercase font-medium text-[12px] editBtn"
    >
      Edit
    </button>
    <button
      class="bg-red-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 hover:bg-red-600 text-white uppercase font-medium text-[12px] deleteBtn"
    >
      Delete
    </button>
    <button
      class="bg-green-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 hover:bg-green-600 text-white uppercase font-medium text-[12px] completeBtn"
    >
      ${btnText}
    </button>
  </div>
  <div class="prior-wrapper">
    <h3 class="text-[12px] font-medium mb-[5px]">Task Priority</h3>
    <div class="prior-sel flex gap-x-[10px]">
      <input
        type="radio"
        name="${uniqueName}"
        id="high-${key}"
        class="hidden"
        ${isHighChecked}
      />
      <label
        data-prio="high"
        for="high-${key}"
        class="bg-pink-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 text-white uppercase font-medium text-[12px] opacity-[0.5] cursor-pointer"
      >
        High
      </label>
      <input
        type="radio"
        name="${uniqueName}"
        id="medium-${key}"
        class="hidden"
        ${isMediumChecked}
      />
      <label
        data-prio="medium"
        for="medium-${key}"
        class="bg-pink-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 text-white uppercase font-medium text-[12px] opacity-[0.5] cursor-pointer"
      >
        Medium
      </label>
      <input
        type="radio"
        name="${uniqueName}"
        id="low-${key}"
        class="hidden"
        ${isLowChecked}
      />
      <label
        for="low-${key}"
        data-prio="low"
        class="bg-pink-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 text-white uppercase font-medium text-[12px] opacity-[0.5] cursor-pointer"
      >
        Low
      </label>
    </div>
  </div>
</div>
  `;

  taskList.innerHTML += taskBox;
};

// Edit Task
let editTask = () => {
  let editBtns = document.querySelectorAll(".editBtn");
  let editAble = false;
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      let taskBox = editBtn.closest(".task-box");
      let editTitle = taskBox.querySelector("#taskTitle");
      if (!editAble) {
        editTitle.disabled = false;
        editTitle.style.border = "solid 1px black";
        editBtn.innerText = "Save";
        editAble = true;
      } else {
        editTitle.disabled = true;
        editTitle.style.border = "none";
        editBtn.innerText = "Edit";
        editAble = false;

        let boxKey = taskBox.getAttribute("data-key");
        let taskData = JSON.parse(localStorage.getItem(boxKey));
        taskData.inputTaskTitle = editTitle.value;
        localStorage.setItem(boxKey, JSON.stringify(taskData));
      }
    });
  });
};

// Delete Tasks
let deleteTask = () => {
  let deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      let taskBox = deleteBtn.closest(".task-box");
      let taskTitle = taskBox.querySelector("#taskTitle");
      let boxKey = taskBox.getAttribute("data-key");
      localStorage.removeItem(boxKey);
      taskList.innerHTML = "";
      if (isSearching) {
        searchData(searchString);
      } else {
        addBoxes();
      }
    });
  });
};

// For Getting Searched Strings
let searchData = (string) => {
  const keys = Object.keys(localStorage);

  let allData = keys.map((key) => {
    let myData = JSON.parse(localStorage.getItem(key));
    let myTitle = myData.inputTaskTitle.toLowerCase();
    let myStatus = myData.inputTaskStatus;
    let myPrior = myData.inputTaskPrior;
    return {
      key: key,
      title: myTitle,
      staus: myStatus,
      priority: myPrior,
    };
  });
  // console.log(allData);

  let lowerSearchString = string.toLowerCase();
  let result = allData.filter((item) => item.title.includes(lowerSearchString));

  // console.log(result);

  for (let i = 0; i < result.length; i++) {
    let searchTaskKey = result[i].key;
    let searchTaskTitle = result[i].title;
    let searchTaskStatus = result[i].status;
    let searchTaskPrior = result[i].priority;
    // console.log(searchTaskKey, searchTaskTitle, searchTaskStatus);
    addTask(searchTaskTitle, searchTaskKey, searchTaskStatus, searchTaskPrior);
  }

  editTask();
  deleteTask();
  checkTask();
  sortBox();
  prioSelection();
};

// Complete Task
let checkTask = () => {
  let completeBtns = document.querySelectorAll(".completeBtn");

  completeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let taskBox = btn.closest(".task-box");
      let boxStatus = taskBox.getAttribute("data-status");
      let boxKey = taskBox.getAttribute("data-key");

      if (boxStatus === "false") {
        taskBox.setAttribute("data-status", "true");
        btn.innerText = "Not Complete";
        boxStatus = taskBox.getAttribute("data-status");
      } else {
        taskBox.setAttribute("data-status", "false");
        btn.innerText = "Complete";
        boxStatus = taskBox.getAttribute("data-status");
      }

      let taskData = JSON.parse(localStorage.getItem(boxKey));
      taskData.inputTaskStatus = boxStatus;
      localStorage.setItem(boxKey, JSON.stringify(taskData));
      taskList.innerHTML = "";
      addBoxes();
    });
  });
};

// Priority Selection
let prioSelection = () => {
  let priorSelect = document.querySelectorAll(".prior-sel");
  priorSelect.forEach((prior) => {
    let priorBtns = prior.querySelectorAll("label");

    priorBtns.forEach((btn) => {
      let taskBox = btn.closest(".task-box");
      let taskBoxKey = taskBox.getAttribute("data-key");
      btn.addEventListener("click", () => {
        let btnPrio = btn.getAttribute("data-prio");

        let taskData = JSON.parse(localStorage.getItem(taskBoxKey));
        taskData.inputTaskPrior = btnPrio;
        localStorage.setItem(taskBoxKey, JSON.stringify(taskData));
        taskList.innerHTML = "";
        addBoxes();
      });
    });
  });
};

// Sort Box
let sortBox = () => {
  let boxArr = Array.from(taskList.querySelectorAll(".task-box"));
  // console.log(boxArr);

  let lowBox = boxArr.filter((box) => {
    let boxAttr = box.getAttribute("data-prior");
    return boxAttr === "low";
  });

  let medBox = boxArr.filter((box) => {
    let boxAttr = box.getAttribute("data-prior");
    return boxAttr === "medium";
  });
  let highBox = boxArr.filter((box) => {
    let boxAttr = box.getAttribute("data-prior");
    return boxAttr === "high";
  });
  let completeBox = boxArr.filter((box) => {
    let boxAttr = box.getAttribute("data-status");
    return boxAttr === "true";
  });
  taskList.innerHTML = "";
  highBox.forEach((box) => {
    taskList.appendChild(box);
  });
  medBox.forEach((box) => {
    taskList.appendChild(box);
  });
  lowBox.forEach((box) => {
    taskList.appendChild(box);
  });
  completeBox.forEach((box) => {
    taskList.appendChild(box);
  });
};
addBoxes();
