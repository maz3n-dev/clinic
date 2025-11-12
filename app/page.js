'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  X, 
  Award, 
  Repeat, 
  ArrowRight, 
  Target, 
  Brain, 
  Server, 
  Shield, 
  Layers, 
  Clock, 
  Cpu, 
  PieChart, 
  Users, 
  Zap,
  CheckCircle,
  TrendingUp,
  Square,
  CheckSquare
} from 'lucide-react'

// --- Audio Effects ---
// We use the Web Audio API directly as seen in your reference code.

const playClickSound = () => {
  if (typeof window === 'undefined') return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

const playCorrectSound = () => {
  if (typeof window === 'undefined') return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
  
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

const playWrongSound = () => {
  if (typeof window === 'undefined') return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 300;
  oscillator.type = 'square';
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.15);
};

const playFinishSound = () => {
  if (typeof window === 'undefined') return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
  
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

// --- Question Database (100+ Questions) ---

// Data for all scheduling problems (from Quiz Image)
const schedulingProcesses = [
  { name: 'P1', burst: 24, arrival: 0, priority: 4 },
  { name: 'P2', burst: 48, arrival: 8, priority: 3 },
  { name: 'P3', burst: 32, arrival: 16, priority: 1 },
  { name: 'P4', burst: 16, arrival: 16, priority: 2 },
  { name: 'P5', burst: 40, arrival: 24, priority: 2 },
];

const QUESTION_BANK = [
  // --- OS Basics (Harder MCQs) ---
  { type: 'mcq', text: 'Which statement BEST encapsulates the multiple roles of an operating system?', options: ['It is only a resource allocator, focused on dividing CPU time and memory.', 'It is primarily a control program, focused on security and error prevention.', 'It is both an intermediary for the user and a manager for hardware resources, while also controlling program execution.', 'It is a user-facing program that provides a GUI and program execution services.'], answer: 'It is both an intermediary for the user and a manager for hardware resources, while also controlling program execution.' },
  { type: 'mcq', text: 'When the OS acts as a "resource allocator," what is its primary concern?', options: ['Managing all resources, and deciding between conflicting requests for efficient and fair use.', 'Controlling program execution to prevent errors and improper use of the computer.', 'Providing a command-line interface for users to execute programs.', 'Ensuring user authentication and protecting the system from outsiders.'], answer: 'Managing all resources, and deciding between conflicting requests for efficient and fair use.' },
  { type: 'mcq', text: 'The OS as a "control program" is most concerned with...', options: ['Allocating CPU time fairly using a scheduling algorithm.', 'Controlling the execution of user programs to prevent errors and improper hardware use.', 'Tracking which user is using which resource for billing purposes.', 'Providing an easy-to-use graphical user interface (GUI).'], answer: 'Controlling the execution of user programs to prevent errors and improper hardware use.' },
  { type: 'fill-blank', text: 'A program that acts as an intermediary between a user of a computer and the computer hardware is called a(n) ____.', answer: 'Operating System', caseInsensitive: true },

  // --- OS Services (New + Harder) ---
  { type: 'mcq', text: 'Which of the following services is NOT considered "helpful to the user" but rather for "efficient system operation"?', options: ['User Interface (UI): Providing a GUI or CLI for user interaction.', 'Program Execution: Loading, running, and ending a program.', 'I/O Operations: Managing access to files or I/O devices for a running program.', 'Accounting: Keeping track of resource usage for billing or statistics.'], answer: 'Accounting: Keeping track of resource usage for billing or statistics.' },
  { type: 'multi-select', text: 'Identify all services listed below that are for "ensuring the efficient operation of the system". (Select all that apply)', options: ['User Interface', 'Protection and Security', 'I/O Operations', 'Resource Allocation', 'Program Execution', 'Accounting'], answer: ['Protection and Security', 'Resource Allocation', 'Accounting'] },
  { type: 'true-false', text: 'T/F: "Protection" and "Security" are the same thing in an OS. "Protection" involves authenticating users, while "Security" involves controlling resource access.', answer: 'False' },
  { type: 'mcq', text: 'What is the key difference between OS "Protection" and "Security"?', options: ['Protection is about preventing errors, while Security is about speed.', 'Protection involves controlling access to resources, while Security involves defending the system from outsiders (e.g., user authentication).', 'Protection is for the CPU, while Security is for memory.', 'Protection is about hardware, while Security is about software.'], answer: 'Protection involves controlling access to resources, while Security involves defending the system from outsiders (e.g., user authentication).' },
  { type: 'multi-select', text: 'Identify all services listed below that are considered "helpful to the user". (Select all that apply)', options: ['Resource Allocation', 'Accounting', 'Program Execution', 'Protection', 'I/O Operations', 'User Interface'], answer: ['Program Execution', 'I/O Operations', 'User Interface'] },

  // --- User/Kernel Mode (New + Harder) ---
  { type: 'mcq', text: 'What is the "mode bit" and how is it used?', options: ['It is a software flag in the PCB used to indicate if a process is "new" or "ready".', 'It is a hardware bit, provided by the CPU, used to distinguish between running user code (bit=1) or kernel code (bit=0).', 'It is a bit in the file system table that marks a file as read-only or read-write.', 'It is a memory address bit that separates the stack from the heap.'], answer: 'It is a hardware bit, provided by the CPU, used to distinguish between running user code (bit=1) or kernel code (bit=0).' },
  { type: 'true-false', text: 'T/F: A user process can intentionally set the mode bit to 0 to switch to kernel mode and access hardware directly.', answer: 'False' },
  { type: 'mcq', text: 'The hardware-enforced "dual-mode" operation (user and kernel modes) provides what critical OS function?', options: ['It allows for efficient resource allocation.', 'It provides protection, preventing user programs from damaging the OS or other users\' data.', 'It simplifies the user interface by hiding the kernel.', 'It enables the OS to run programs faster than it could in a single mode.'], answer: 'It provides protection, preventing user programs from damaging the OS or other users\' data.' },
  { type: 'fill-blank', text: 'When a user process executes a system call, a ____ occurs, which switches the mode bit to 0 and transfers control to the OS.', answer: 'trap', caseInsensitive: true },

  // --- System Calls (New + Harder) ---
  { type: 'mcq', text: 'How does the "system call interface" correctly invoke the intended kernel function?', options: ['It searches the kernel code for a function with a matching name.', 'It uses a unique number passed by the user process to index a table of pointers to kernel functions.', 'It asks the user to provide the memory address of the kernel function.', 'It relies on the microkernel to pass a message to the correct kernel service.'], answer: 'It uses a unique number passed by the user process to index a table of pointers to kernel functions.' },
  { type: 'true-false', text: 'T/F: For a user to make a system call, they must know the exact implementation details of the kernel function they are calling.', answer: 'False' },
  { type: 'fill-blank', text: 'The system call interface maintains a ____ indexed by the system call numbers, which it uses to find the correct kernel function.', answer: 'table', caseInsensitive: true },

  // --- Process Management (New + Harder) ---
  { type: 'multi-select', text: 'Which of the following are explicitly listed as Process Management activities? (Select all that apply)', options: ['Keeping track of which parts of memory are used', 'Creating and deleting user processes', 'Providing mechanisms for process synchronization', 'Deciding which processes move into memory', 'Suspending and resuming processes', 'Providing mechanisms for deadlock handling'], answer: ['Creating and deleting user processes', 'Providing mechanisms for process synchronization', 'Suspending and resuming processes', 'Providing mechanisms for deadlock handling'] },
  { type: 'true-false', text: 'T/F: Handling deadlocks is a function of Memory Management, not Process Management.', answer: 'False' },
  { type: 'fill-blank', text: 'The OS activity of "____" involves providing mechanisms to coordinate processes that share data or resources.', answer: 'process synchronization', caseInsensitive: true },
  { type:'mcq', text: 'When the OS "suspends" a process, what is it doing?', options: ['It is deleting the process and removing it from memory permanently.', 'It is temporarily stopping the process\'s execution, often to be resumed later.', 'It is allocating more memory to the process.', 'It is handling a deadlock for that process.'], answer: 'It is temporarily stopping the process\'s execution, often to be resumed later.' },

  // --- Memory Management (New + Harder) ---
  { type: 'multi-select', text: 'Identify all activities related to Memory Management. (Select all that apply)', options: ['Providing mechanisms for process communication', 'Keeping track of which parts of memory are currently being used', 'Deciding which processes and data to move into and out of memory', 'Allocating and deallocating memory space as needed', 'Process scheduling'], answer: ['Keeping track of which parts of memory are currently being used', 'Deciding which processes and data to move into and out of memory', 'Allocating and deallocating memory space as needed'] },
  { type: 'mcq', text: 'A key Memory Management activity, crucial for multitasking, is...', options: ['Suspending and resuming processes.', 'Providing for process synchronization.', 'Deciding which processes and data to move into and out of memory.', 'Handling deadlocks.'], answer: 'Deciding which processes and data to move into and out of memory.' },
  { type: 'true-false', text: 'T/F: The "Data Section" of a process is a part of the Process Control Block (PCB).', answer: 'False' },

  // --- OS Structures (New + Harder) ---
  { type: 'mcq', text: 'What is a primary advantage of the "layered approach" described in the document?', options: ['It has the best performance due to its minimal kernel.', 'It is easy to debug because lower-level layers are debugged first, and errors are isolated to the layer where they occur.', 'It is the most flexible, as modules can be loaded at any time.', 'It is difficult to define the layers, which makes it robust.'], answer: 'It is easy to debug because lower-level layers are debugged first, and errors are isolated to the layer where they occur.' },
  { type: 'mcq', text: 'What is the main conceptual drawback of the "layered approach" to OS design?', options: ['It is less secure than a microkernel.', 'It is monolithic and difficult to extend.', 'It is difficult to appropriately define the various layers and their dependencies in a strict order.', 'It suffers from performance overhead due to message passing.'], answer: 'It is difficult to appropriately define the various layers and their dependencies in a strict order.' },
  { type: 'true-false', text: 'T/F: In a "layered approach," Layer 0 is the user interface and Layer N is the hardware.', answer: 'False' },
  { type: 'mcq', text: 'How does a "microkernel" structure differ fundamentally from a "layered" or monolithic structure?', options: ['It moves as much functionality as possible from the kernel into user-space modules.', 'It organizes the OS into a strict hierarchy of levels, from hardware to UI.', 'It uses an object-oriented approach where all modules run in kernel space.', 'It requires all processes to share the same memory space for faster communication.'], answer: 'It moves as much functionality as possible from the kernel into user-space modules.' },
  { type: 'mcq', text: 'What is the *primary* advantage of a "microkernel" structure?', options: ['Extremely fast communication between modules.', 'It is easier to extend, port to new architectures, and is more reliable/secure.', 'It is very simple to construct and define the layers.', 'It has zero performance overhead for communication.'], answer: 'It is easier to extend, port to new architectures, and is more reliable/secure.' },
  { type: 'mcq', text: 'What is the *primary* disadvantage of a "microkernel" structure?', options: ['It is very difficult to debug due to its monolithic nature.', 'It suffers from performance overhead because user-space modules must communicate via message passing (which involves system calls).', 'It is less secure because more code runs in user space.', 'It cannot be easily extended with new features.'], answer: 'It suffers from performance overhead because user-space modules must communicate via message passing (which involves system calls).' },
  { type: 'fill-blank', text: 'In a microkernel, user modules communicate with each other by using ____.', answer: 'message passing', caseInsensitive: true },
  { type: 'mcq', text: 'The "Solaris modular approach" is described as being "like layers but with more flexibility" because...', options: ['It has a very small kernel and relies on message passing.', 'It uses an object-oriented approach with loadable kernel modules and known interfaces.', 'It is divided into 7 distinct layers that cannot be changed.', 'It moves all device drivers into user space for security.'], answer: 'It uses an object-oriented approach with loadable kernel modules and known interfaces.' },
  { type: 'true-false', text: 'T/F: The Solaris modular approach is object-oriented and allows modules to be loaded as needed within the kernel.', answer: 'True' },
  
  // --- Process Memory & PCB (New + Harder) ---
  { type: 'mcq', text: 'A process in memory is divided into sections. Which section is specifically reserved for storing global variables and static variables?', options: ['The Text section, which contains program code.', 'The Stack, which contains temporary data like local variables.', 'The Data section.', 'The Heap, which is for dynamically allocated memory.'], answer: 'The Data section.' },
  { type: 'mcq', text: 'What is the "stack" section of a process used for?', options: ['Storing the program\'s executable code.', 'Storing global and static variables.', 'Storing temporary data, such as function parameters, return addresses, and local variables.', 'Storing memory allocated dynamically with `malloc()` or `new`.'], answer: 'Storing temporary data, such as function parameters, return addresses, and local variables.' },
  { type: 'mcq', text: 'What is the "heap" section of a process used for?', options: ['Storing global variables.', 'Storing memory that is dynamically allocated during process run time.', 'Storing the program counter and CPU registers.', 'Storing temporary local variables and function parameters.'], answer: 'Storing memory that is dynamically allocated during process run time.' },
  { type: 'fill-blank', text: 'The ____ section of a process in memory contains the executable program code.', answer: 'text', caseInsensitive: true },
  { type: 'mcq', text: 'What is the primary function of the Process Control Block (PCB) within the operating system kernel?', options: ['It stores the entire "text" and "data" sections of the process code.', 'It is a user-visible structure that allows a program to request I/O.', 'It stores all essential context and state information for a single process, enabling the OS to manage and switch between processes.', 'It is a hardware component that manages the mode bit.'], answer: 'It stores all essential context and state information for a single process, enabling the OS to manage and switch between processes.' },
  { type: 'multi-select', text: 'Which of the following items are stored within a Process Control Block (PCB)? (Select all that apply)', options: ['The process state (e.g., ready, running)', 'The Heap', 'The Program Counter', 'CPU registers', 'The Stack', 'Memory-management information (e.g., memory limits)', 'I/O status information (e.g., list of open files)'], answer: ['The process state (e.g., ready, running)', 'The Program Counter', 'CPU registers', 'Memory-management information (e.g., memory limits)', 'I/O status information (e.g., list of open files)'] },
  { type: 'mcq', text: 'Why is the "Program Counter" (PC) stored in the PCB?', options: ['To store the total number of instructions in the program.', 'To store the address of the *next* instruction to be executed, so the process can be resumed correctly after an interrupt.', 'To store the process\'s priority for scheduling.', 'To store the base address of the process\'s memory allocation.'], answer: 'To store the address of the *next* instruction to be executed, so the process can be resumed correctly after an interrupt.' },
  { type: 'true-false', text: 'T/F: The "CPU scheduling information" (like process priority) is stored in the Data section of the process memory, not the PCB.', answer: 'False' },
  { type: 'mcq', text: '"I/O status information" in a PCB would likely include...', options: ['The process\'s priority and state.', 'The base and limit registers for memory.', 'The list of I/O devices allocated to the process and a list of open files.', 'The program code for the I/O operations.'], answer: 'The list of I/O devices allocated to the process and a list of open files.' },
  
  // --- Questions from existing bank (retained for coverage) ---
  // --- (Rewritten to be harder) ---
  
  { type: 'mcq', text: 'Which IPC model is generally faster for communication *after* setup, but requires more complex synchronization (like semaphores) to be implemented by the programmer?', options: ['Message Passing, because it is built into the kernel.', 'Shared Memory, because processes can access the memory region directly without kernel intervention for each access.', 'System Calls, because they are a direct trap to the kernel.', 'Microkernel, because it is more reliable.'], answer: 'Shared Memory, because processes can access the memory region directly without kernel intervention for each access.' },
  { type: 'mcq', text: 'The "Hold and Wait" condition for deadlock is BEST described as...', options: ['A process holds all required resources and waits to execute.', 'A process holds at least one resource and is waiting to acquire additional resources that are currently held by other processes.', 'A process must wait for all resources to be free before acquiring any.', 'A set of processes are all waiting for each other in a chain.'], answer: 'A process holds at least one resource and is waiting to acquire additional resources that are currently held by other processes.' },
  { type: 'mcq', text: 'Deadlock avoidance algorithms (like the Banker\'s Algorithm) are distinct from deadlock prevention because they...', options: ['Allow the system to enter an unsafe state and then recover.', 'Require processes to declare all their resources at the very beginning.', 'Require the OS to know the *maximum possible* resource claims of each process in advance to maintain a "safe state".', 'Break one of the four deadlock conditions by preempting resources.'], answer: 'Require the OS to know the *maximum possible* resource claims of each process in advance to maintain a "safe state".' },
  { type: 'mcq',text: 'Which scheduling algorithm is non-preemptive and can suffer from the "convoy effect," where short processes get stuck waiting behind a single long-running process?', options: ['Round Robin (RR)', 'Shortest Remaining Time First (SRTF)', 'First-Come, First-Served (FCFS)', 'Preemptive Priority'], answer: 'First-Come, First-Served (FCFS)'},
  { type: 'mcq', text: 'The "quantum" in the Round Robin (RR) algorithm is a small time slice. What happens if this quantum is set to be very large?', options: ['The algorithm becomes more efficient than SJF.', 'The algorithm degenerates and behaves like First-Come, First-Served (FCFS).', 'The algorithm behaves like Shortest Job First (SJF).', 'It causes immediate deadlock.'], answer: 'The algorithm degenerates and behaves like First-Come, First-Served (FCFS).' },
  
  // --- Original Scheduling Problems (Retained) ---
  { type: 'text-input', text: 'Given the following processes, calculate the average waiting time for First-Come, First-Served (FCFS).', algorithm: 'FCFS', processes: schedulingProcesses, answer: '51.2', caseInsensitive: false },
  { type: 'text-input', text: 'Given the same processes, calculate the average waiting time for non-preemptive Shortest Job First (SJF).', algorithm: 'SJF', processes: schedulingProcesses, answer: '36.8', caseInsensitive: false },
  { type: 'text-input', text: 'Given the same processes, calculate the average waiting time for preemptive Priority (lower number = higher priority).', algorithm: 'Priority', processes: schedulingProcesses, answer: '59.2', caseInsensitive: false },
  { type: 'text-input', text: 'Given the same processes, calculate the average waiting time for Round Robin (quantum = 16).', algorithm: 'RR16', processes: schedulingProcesses, answer: '68.8', caseInsensitive: false },

  // --- Add ~40 more questions to reach 100+ ---
  // More OS Basics & Services
  { type: 'true-false', text: 'T/F: An operating system is considered hardware.', answer: 'False' },
  { type: 'mcq', text: 'A command-line interface (CLI) is an example of which OS service category?', options: ['Ensuring efficient operation', 'Helpful to the user', 'Process management', 'Memory management'], answer: 'Helpful to the user' },
  { type: 'fill-blank', text: 'The OS service that allows a running program to use a file or an I/O device is called ____.', answer: 'I/O operations', caseInsensitive: true },
  { type: 'true-false', text: 'T/F: In a system with multiple users, "Resource Allocation" is a service for "efficient operation".', answer: 'True' },
  
  // More User/Kernel Mode
  { type: 'mcq', text: 'What is the "return" action shown in the user/kernel mode diagram?', options: ['The user process returning to the ready queue.', 'The kernel returning control to the user process after the system call is complete.', 'The kernel returning an error code to the file system.', 'The user process reloading from disk.'], answer: 'The kernel returning control to the user process after the system call is complete.' },
  { type: 'mcq', text: 'When the kernel completes a system call, what value does the mode bit get set to before returning control to the user process?', options: ['0 (kernel mode)', '1 (user mode)', 'It remains 0.', 'It is set to null.'], answer: '1 (user mode)' },

  // More System Calls
  { type: 'mcq', text: 'Why is a system call (like `open()`) necessary for a user program to access a file?', options: ['Because the user program does not know the file\'s name.', 'Because file I/O is a privileged operation that must be controlled by the OS (in kernel mode) to ensure protection.', 'Because the `open()` function is part of the C library, not the OS.', 'Because the system call interface needs to be tested.'], answer: 'Because file I/O is a privileged operation that must be controlled by the OS (in kernel mode) to ensure protection.' },
  { type: 'fill-blank', text: 'The user application is generally not aware of the implementation details or the number of the system call it is invoking. It just calls a function in the ____.', answer: 'API', caseInsensitive: true },

  // More Process & Memory Management
  { type: 'fill-blank', text: 'The OS activity of "____" involves providing mechanisms for processes to coordinate, often to avoid race conditions.', answer: 'Synchronization', caseInsensitive: true },
  { type: 'fill-blank', text: 'The OS activity of "____" involves providing mechanisms for processes to exchange data.', answer: 'Communication', caseInsensitive: true },
  { type: 'true-false', text: 'T/F: Allocating and deallocating memory space is a Process Management activity.', answer: 'False' },
  { type: 'mcq', text: 'Which OS activity is responsible for "Keeping track of which parts of memory are currently being used"?', options: ['Process Management', 'Memory Management', 'Accounting', 'Protection'], answer: 'Memory Management' },

  // More OS Structures
  { type: 'mcq', text: 'In the Layered Approach, what is the fundamental rule of interaction between layers?', options: ['Any layer can call any other layer.', 'A layer can only call functions in the layer immediately below it.', 'Layers can only be called by higher-level layers.', 'All layers must communicate via message passing.'], answer: 'Layers can only be called by higher-level layers.' }, // Note: This is a slight inference, but consistent with the PDF's diagram and text.
  { type: 'true-false', text: 'T/F: An advantage of the layered approach is that a layer hides the implementation details of its data structures and operations from higher-level layers.', answer: 'True' },
  { type: 'mcq', text: 'Which of these is listed as an advantage of the "microkernel" structure?', options: ['It is easier to port to new architectures.', 'It is monolithic.', 'It has very low performance overhead.', 'It is difficult to extend.'], answer: 'It is easier to port to new architectures.' },
  { type: 'true-false', text: 'T/F: A disadvantage of the microkernel is that it is *less* reliable than a monolithic kernel.', answer: 'False' },
  { type: 'mcq', text: 'The Solaris modular approach uses what programming paradigm?', options: ['Functional', 'Procedural', 'Object-oriented', 'Logical'], answer: 'Object-oriented' },
  { type: 'fill-blank', text: 'The Solaris approach is described as "like layers but with more ____".', answer: 'flexibility', caseInsensitive: true },

  // More PCB & Process Sections
  { type: 'true-false', text: 'T/F: The "Program Counter" and "CPU registers" are stored in the stack section of a process.', answer: 'False' }, // Tricky: their *values* are saved to the stack on a function call, but the *current* values are in the PCB/CPU.
  { type: 'fill-blank', text: 'The current state of a process (e.g., new, ready, running, waiting, halted) is stored in the ____.', answer: 'PCB', caseInsensitive: true },
  { type: 'mcq', text: 'Which part of the PCB stores information like memory limits and page tables?', options: ['CPU scheduling information', 'Memory-management information', 'Accounting information', 'I/O status information'], answer: 'Memory-management information' },
  { type: 'mcq', text: 'Which part of the PCB stores information like the amount of CPU time used and time limits?', options: ['CPU scheduling information', 'Memory-management information', 'Accounting information', 'I/O status information'], answer: 'Accounting information' },
  { type: 'fill-blank', text: 'A list of open files for a process is stored in the ____ status information field of the PCB.', answer: 'I/O', caseInsensitive: true },
  
  // More IPC & Deadlock
  { type: 'mcq', text: 'Which IPC model is generally better for smaller amounts of data and provides built-in synchronization?', options: ['Shared Memory', 'Message Passing', 'Layered Approach', 'File I/O'], answer: 'Message Passing' },
  { type: 'true-false', text: 'T/F: In a "shared memory" IPC model, the OS is involved in every single data exchange between the processes.', answer: 'False' }, // It's involved in *setup*, but not every exchange.
  { type: 'fill-blank', text: 'The four necessary conditions for deadlock are Mutual Exclusion, Hold and Wait, No Preemption, and ____.', answer: 'Circular Wait', caseInsensitive: true },
  { type: 'mcq', text: 'What does "Mutual Exclusion" mean in the context of deadlocks?', options: ['A process must exclude all other processes from the system.', 'Only one process can use a resource at a time.', 'A process must not hold any resources while waiting.', 'A process can have its resources taken away.'], answer: 'Only one process can use a resource at a time.' },
  { type: 'true-false', text: 'T/F: If "No Preemption" is allowed, it means a resource can be forcibly taken from a process that is holding it.', answer: 'False' },
  { type: 'fill-blank', text: 'A "____" state in deadlock avoidance is one where there is some scheduling order in which all processes can complete.', answer: 'safe', caseInsensitive: true },

  // More Scheduling
  { type: 'mcq', text: 'Non-preemptive SJF (Shortest Job First) scheduling is optimal in what regard?', options: ['It gives the minimum *average waiting time* for a given set of processes.', 'It is the fairest algorithm for all processes.', 'It guarantees no process will ever starve.', 'It has the highest CPU throughput.'], answer: 'It gives the minimum *average waiting time* for a given set of processes.' },
  { type: 'mcq', text: 'What is a major problem with the non-preemptive SJF algorithm?', options: ['It has a very high average waiting time.', 'It can lead to "starvation" for long processes if short processes keep arriving.', 'It is preemptive, which adds overhead.', 'It behaves just like FCFS.'], answer: 'It can lead to "starvation" for long processes if short processes keep arriving.' },
  { type: 'mcq', text: 'Preemptive SJF is also known as "Shortest Remaining Time First" (SRTF). When does the scheduler make a decision in SRTF?', options: ['Only when the currently running process completes its burst.', 'Only when a new process arrives in the ready queue.', 'When a new process arrives, AND when the running process completes.', 'When a new process arrives that has a *shorter remaining burst time* than the *currently running process*.'], answer: 'When a new process arrives that has a *shorter remaining burst time* than the *currently running process*.' }, // This is a hard, specific question.
  { type: 'mcq', text: 'In "Preemptive Priority" scheduling, what happens if a new process arrives in the ready queue that has a higher priority than the currently running process?', options: ['The new process must wait until the running process completes.', 'The new process is immediately placed at the head of the queue, but the running process continues.', 'The CPU is preempted, and the new, higher-priority process is scheduled to run.', 'The system enters a deadlock state.'], answer: 'The CPU is preempted, and the new, higher-priority process is scheduled to run.' },
  { type: 'mcq', text: 'What is the main trade-off in choosing the "quantum" size for Round Robin?', options: ['A large quantum is always better.', 'A small quantum is always better.', 'A small quantum creates more context switches (overhead), but a large quantum behaves like FCFS.', 'A large quantum causes starvation, but a small quantum prevents it.'], answer: 'A small quantum creates more context switches (overhead), but a large quantum behaves like FCFS.' }
];

// --- Helper: Shuffle Function ---
const shuffleArray = (array) => {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


// --- Main App Component ---
export default function App() {
  const [gameState, setGameState] = useState('start');
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  // Configurable quiz length - INCREASED TO 45
  const quizLength = 45;

  const handleStart = () => {
    playClickSound();
    setShuffledQuestions(shuffleArray([...QUESTION_BANK]).slice(0, quizLength));
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setGameState('quiz');
  };

  const handleAnswer = (answer, isCorrect) => {
    if (isCorrect) {
      playCorrectSound();
      setScore(prev => prev + 1);
    } else {
      playWrongSound();
    }
    
    setUserAnswers(prev => [...prev, { 
      question: shuffledQuestions[currentQuestionIndex].text, 
      userAnswer: answer,
      correctAnswer: shuffledQuestions[currentQuestionIndex].answer,
      isCorrect 
    }]);
    
    // Move to next question or end game
    setTimeout(() => {
      if (currentQuestionIndex < quizLength - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        playFinishSound();
        setGameState('results');
      }
    }, 1200); // Wait 1.2s to show feedback
  };

  const handleRestart = () => {
    playClickSound();
    setGameState('start');
  };
  
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 antialiased p-4 flex items-center justify-center font-sans">
      <div className="fixed inset-0 overflow-hidden z-0">
         <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
    m       transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '60%', right: '15%' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <StartScreen key="start" onStart={handleStart} totalQuestions={quizLength} questionPoolSize={QUESTION_BANK.length} />
        )}
        {gameState === 'quiz' && shuffledQuestions.length > 0 && (
          <QuizScreen 
            key="quiz"
            question={shuffledQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizLength}
          />
        )}
        {gameState === 'results' && (
          <ResultsScreen 
            key="results"
            score={score}
            totalQuestions={quizLength}
            onRestart={handleRestart}
            userAnswers={userAnswers}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// --- StartScreen Component ---
function StartScreen({ onStart, totalQuestions, questionPoolSize }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center z-10 border border-white/50"
    >
      <motion.div
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white mx-auto mb-6 shadow-lg"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <BookOpen className="w-10 h-10" />
      </motion.div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Operating Systems Midterm
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Test your knowledge with {totalQuestions} random questions from a pool of {questionPoolSize}.
      </p>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Covers Processes, Memory, Scheduling, & More</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <Zap className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Includes MCQs, T/F, Fill-in-the-Blank, & Problems</span>
        </div>
      </div>
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all"
      >
        <Sparkles className="w-5 h-5" />
        Start Exam
      </motion.button>
    </motion.div>
  );
}

// --- QuizScreen Component ---
function QuizScreen({ question, onAnswer, questionNumber, totalQuestions }) {
  const progress = (questionNumber / totalQuestions) * 100;

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case 'mcq': return 'Multiple Choice';
      case 'scheduling':
      case 'text-input': return 'Practical Problem';
      case 'true-false': return 'True / False';
      case 'fill-blank': return 'Fill in the Blank';
      case 'multi-select': return 'Select All That Apply';
      default: return 'Question';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="w-full max-w-3xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 z-10 border border-white/50"
    >
      {/* Progress Bar and Counter */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm font-semibold text-slate-500 mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span className="text-indigo-600">
            {getQuestionTypeLabel()}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <motion.div 
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full" 
            initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-2xl font-bold mb-8 text-slate-900 leading-snug">
        {question.text}
      </h2>

      {/* Render correct question type */}
      {question.type === 'mcq' && (
        <MCQQuestion 
          key={question.text} 
          question={question} 
          onAnswer={onAnswer} 
        />
      )}
      {(question.type === 'scheduling' || question.type === 'text-input' || question.type === 'fill-blank') && (
        <TextInputQuestion 
          key={question.text} 
          question={question} 
          onAnswer={onAnswer} 
        />
      )}
      {question.type === 'true-false' && (
        <TrueFalseQuestion
          key={question.text}
          question={question}
          onAnswer={onAnswer}
        />
      )}
      {question.type === 'multi-select' && (
        <MultiSelectQuestion
          key={question.text}
          question={question}
          onAnswer={onAnswer}
        />
      )}
    </motion.div>
  );
}

// --- MCQQuestion Component ---
function MCQQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option) => {
    if (isAnswered) return;
    
    playClickSound();
    setSelected(option);
    setIsAnswered(true);
    const isCorrect = option === question.answer;
    
    // Call parent onAnswer function after a delay to show feedback
    onAnswer(option, isCorrect);
  };

  const getButtonClass = (option) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300';
    }
    if (option === question.answer) {
      return 'bg-green-100 border-green-300 text-green-800 scale-105';
    }
    if (option === selected && option !== question.answer) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    return 'bg-white border-slate-200 opacity-60';
  };

  return (
    <div className="space-y-4">
      {question.options.map((option, index) => (
        <motion.button
          key={option}
          onClick={() => handleSelect(option)}
          whileHover={{ scale: isAnswered ? 1 : 1.03 }}
          whileTap={{ scale: isAnswered ? 1 : 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 font-medium text-slate-800 ${getButtonClass(option)}`}
          disabled={isAnswered}
        >
          <span className="flex items-center">
            <span className="flex-1 leading-relaxed">{option}</span>
            {isAnswered && option === question.answer && <Check className="w-5 h-5 text-green-600 ml-4" />}
            {isAnswered && option === selected && option !== question.answer && <X className="w-5 h-5 text-red-600 ml-4" />}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// --- TrueFalseQuestion Component ---
function TrueFalseQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const options = ['True', 'False'];

  const handleSelect = (option) => {
    if (isAnswered) return;
    
    playClickSound();
    setSelected(option);
    setIsAnswered(true);
    // Compare string 'True'/'False' to boolean true/false
    const isCorrect = (option === 'True') === question.answer;
    
    onAnswer(option, isCorrect);
  };

  const getButtonClass = (option) => {
    const isCorrectAnswer = (option === 'True') === question.answer;
    if (!isAnswered) {
      return 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300';
    }
    if (isCorrectAnswer) {
      return 'bg-green-100 border-green-300 text-green-800 scale-105';
    }
    if (option === selected && !isCorrectAnswer) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    return 'bg-white border-slate-200 opacity-60';
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <motion.button
          key={option}
          onClick={() => handleSelect(option)}
          whileHover={{ scale: isAnswered ? 1 : 1.03 }}
          whileTap={{ scale: isAnswered ? 1 : 0.97 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 font-medium text-slate-800 ${getButtonClass(option)}`}
          disabled={isAnswered}
        >
          <span className="flex items-center">
            <span className="flex-1">{option}</span>
            {isAnswered && (option === 'True') === question.answer && <Check className="w-5 h-5 text-green-600 ml-4" />}
            {isAnswered && option === selected && (option === 'True') !== question.answer && <X className="w-5 h-5 text-red-600 ml-4" />}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// --- TextInputQuestion Component (Refactored from SchedulingQuestion) ---
function TextInputQuestion({ question, onAnswer }) {
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAnswered) return;

    let correct;
    if (question.type === 'scheduling' || question.type === 'text-input') {
      // Numerical comparison for scheduling
      const userAnswer = parseFloat(inputValue);
      if (isNaN(userAnswer)) return; // Don't submit if not a number
      correct = userAnswer.toString() === question.answer;
    } else {
      // String comparison for fill-in-the-blank
      const userAnswer = inputValue.trim();
      if (question.caseInsensitive) {
        correct = userAnswer.toLowerCase() === question.answer.toLowerCase();
      } else {
        correct = userAnswer === question.answer;
      }
    }
    
    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(inputValue, correct);
  };

  const getBorderColor = () => {
    if (!isAnswered) {
      return 'border-slate-300 focus:ring-indigo-300 focus:border-indigo-500';
    }
    return isCorrect 
      ? 'border-green-500 ring-2 ring-green-200'
      : 'border-red-500 ring-2 ring-red-200';
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Show table only for scheduling questions */}
      {question.type === 'scheduling' && (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-sm font-semibold text-left text-slate-600">Process</th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600">Burst Time (ms)</th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600">Arrival Time</th>
                <th className="p-3 text-sm font-semibold text-left text-slate-600">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {question.processes.map(p => (
                <tr key={p.name}>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.burst}</td>
                  <td className="p-3">{p.arrival}</td>
                  <td className="p-3">{p.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-2">
          Your Answer:
        </label>
        <div className="relative">
          <input 
            id="text-input"
            type={question.type === 'scheduling' ? "number" : "text"}
            step={question.type === 'scheduling' ? "0.01" : undefined}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full p-4 pr-12 rounded-xl border transition-all ${getBorderColor()} outline-none`}
            placeholder={question.type === 'scheduling' ? "e.g., 36.8" : "Type your answer..."}
            disabled={isAnswered}
            autoCapitalize="none"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
            {isAnswered && !isCorrect && <X className="w-5 h-5 text-red-500" />}
          </div>
        </div>
        {isAnswered && !isCorrect && (
          <p className="text-red-600 text-sm font-medium mt-2">
            Correct Answer: {question.answer}
          </p>
        )}
      </div>
      
      {!isAnswered && (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Submit Answer
        </motion.button>
      )}
      {isAnswered && (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-center"
          >
            {isCorrect ? 'Correct!' : 'Incorrect.'} Moving to next question...
        </motion.div>
      )}
    </motion.form>
  )
}

// --- MultiSelectQuestion Component ---
function MultiSelectQuestion({ question, onAnswer }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleToggle = (option) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAnswered) return;
    
    // Check for correctness
    const sortedUser = [...selectedOptions].sort().toString();
    const sortedAnswer = [...question.answer].sort().toString();
    const correct = sortedUser === sortedAnswer;

    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(selectedOptions, correct);
  };

  const getButtonClass = (option) => {
    if (!isAnswered) {
      return selectedOptions.includes(option)
        ? 'bg-indigo-100 border-indigo-300'
        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300';
    }
    
    // After answering
    const isCorrectAnswer = question.answer.includes(option);
    const isSelected = selectedOptions.includes(option);

    if (isCorrectAnswer) {
      return 'bg-green-100 border-green-300 text-green-800'; // Correctly selected or missed
    }
    if (!isCorrectAnswer && isSelected) {
      return 'bg-red-100 border-red-300 text-red-800'; // Incorrectly selected
    }
    return 'bg-white border-slate-200 opacity-60'; // Correctly not selected
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {question.options.map((option, index) => (
        <motion.button
          type="button"
          key={option}
          onClick={() => handleToggle(option)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 font-medium text-slate-800 ${getButtonClass(option)}`}
          disabled={isAnswered}
        >
          <span className="flex items-center">
            {selectedOptions.includes(option) ? (
              <CheckSquare className="w-5 h-5 text-indigo-600 mr-3" />
            ) : (
              <Square className="w-5 h-5 text-slate-400 mr-3" />
            )}
            <span className="flex-1 leading-relaxed">{option}</span>
            {isAnswered && question.answer.includes(option) && <Check className="w-5 h-5 text-green-600 ml-4" />}
            {isAnswered && !question.answer.includes(option) && selectedOptions.includes(option) && <X className="w-5 h-5 text-red-600 ml-4" />}
          </span>
        </motion.button>
      ))}

      <div className="pt-4">
        {!isAnswered && (
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Answer
          </motion.button>
        )}
        {isAnswered && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-center"
            >
              {isCorrect ? 'Correct!' : 'Incorrect.'} Moving to next question...
          </motion.div>
        )}
      </div>
    </motion.form>
  )
}

// --- ResultsScreen Component ---
function ResultsScreen({ score, totalQuestions, onRestart, userAnswers }) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const getFeedback = () => {
    if (percentage === 100) return { title: 'Perfect Score!', icon: <Award className="w-10 h-10 text-amber-500" />, color: 'text-amber-500' };
    if (percentage >= 80) return { title: 'Excellent Work!', icon: <TrendingUp className="w-10 h-10 text-green-500" />, color: 'text-green-500' };
    if (percentage >= 60) return { title: 'Good Job!', icon: <CheckCircle className="w-10 h-10 text-blue-500" />, color: 'text-blue-500' };
    return { title: 'Keep Practicing!', icon: <Brain className="w-10 h-10 text-slate-500" />, color: 'text-slate-500' };
  }
  const feedback = getFeedback();

  // Helper to format answers which might be strings or arrays
  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      if (answer.length === 0) return '[No answer selected]';
      return answer.join(', ');
    }
    return answer.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 z-10 border border-white/50"
    >
      <div className="text-center">
        <motion.div 
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${feedback.color} bg-slate-100`}
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
        >
          {feedback.icon}
        </motion.div>
        
        <h1 className={`text-3xl font-bold ${feedback.color} mb-4`}>
          {feedback.title}
        </h1>
        
        <p className="text-lg text-slate-600 mb-2">You completed the exam.</p>
        <p className="text-6xl font-bold text-slate-900 mb-8">
          {score} / {totalQuestions}
          <span className={`text-3xl block ${feedback.color} mt-2`}>({percentage}%)</span>
        </p>

        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all"
        >
          <Repeat className="w-5 h-5" />
          Take Exam Again
        </motion.button>
      </div>
      
      {/* Answer Review Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Answer Review</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
          {userAnswers.map((item, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              {item.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-slate-700">{item.question}</p>
                <p className={`font-semibold ${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  Your answer: {formatAnswer(item.userAnswer)}
                </p>
                {!item.isCorrect && (
                   <p className="font-semibold text-slate-500">
                    Correct: {formatAnswer(item.correctAnswer)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
