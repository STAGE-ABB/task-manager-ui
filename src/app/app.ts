import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task } from './models/task';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  tasks: Task[] = [];
  newTaskTitle: string = '';

  editing: boolean = false;
  editingId?: number;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        console.log("DATA:", data);
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addTask(): void {

    if (this.newTaskTitle.trim() === '') {
      return;
    }

    const task: Task = {
      title: this.newTaskTitle
    };

    this.taskService.addTask(task).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.loadTasks();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  editTask(task: Task): void {
    this.editing = true;
    this.editingId = task.id;
    this.newTaskTitle = task.title;
  }
updateTask(): void {

  if (this.newTaskTitle.trim() === '' || this.editingId == null) {
    return;
  }

  const task: Task = {
    id: this.editingId,
    title: this.newTaskTitle
  };

  this.taskService.updateTask(this.editingId, task).subscribe({

    next: () => {
      this.editing = false;
      this.editingId = undefined;
      this.newTaskTitle = '';
      this.loadTasks();
    },

    error: (err) => {
      console.error(err);
    }

  });

}
deleteTask(id: number): void {

  if (!confirm('Voulez-vous supprimer cette tache ?')) {
    return;
  }

  this.taskService.deleteTask(id).subscribe({

    next: () => {
      this.loadTasks();
    },

    error: (err) => {
      console.error(err);
    }

  });

}
}
