import React, { useState, memo } from "react";
import Input from "../Input";
import Textarea from "../Textarea";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaRegTrashAlt } from "react-icons/fa";
import { PortfolioProject } from "@/types/portfolio";

const SortablePortfolioProjectItem = memo(
  ({
    project,
    index,
    editingId,
    setEditingId,
    updateProject,
    removeProject,
  }: {
    project: PortfolioProject;
    index: number;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    updateProject: (id: string, field: string, value: string) => void;
    removeProject: (id: string) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: project.id,
        disabled: editingId === project.id,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <FaGripVertical />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Project {index + 1}
            </span>
          </div>
          <button
            onClick={() => removeProject(project.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaRegTrashAlt />
          </button>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            label="Project Name"
            placeholder="e.g., E-commerce Website"
            value={project.name}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateProject(project.id, "name", e.target.value)}
          />

          <Textarea
            label="Description"
            placeholder="Describe your project..."
            value={project.description}
            rows={3}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateProject(project.id, "description", e.target.value)
            }
          />

          <Input
            type="text"
            label="Tags"
            placeholder="e.g., React, TypeScript, Node.js"
            value={project.tags}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateProject(project.id, "tags", e.target.value)}
          />

          <Input
            type="url"
            label="Live URL"
            placeholder="https://yourproject.com"
            value={project.live_url}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateProject(project.id, "live_url", e.target.value)
            }
          />

          <Input
            type="url"
            label="GitHub URL"
            placeholder="https://github.com/username/project"
            value={project.github_url}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateProject(project.id, "github_url", e.target.value)
            }
          />

          <Input
            type="url"
            label="Image URL"
            placeholder="https://example.com/project-image.jpg"
            value={project.image_url}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateProject(project.id, "image_url", e.target.value)
            }
          />
        </div>
      </div>
    );
  }
);

SortablePortfolioProjectItem.displayName = "SortablePortfolioProjectItem";

type PortfolioProjectsProps = {
  projects: PortfolioProject[];
  setProjects: React.Dispatch<React.SetStateAction<PortfolioProject[]>>;
};

const PortfolioProjects = ({
  projects,
  setProjects,
}: PortfolioProjectsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        tags: "",
        image_url: "",
        live_url: "",
        github_url: "",
        isNew: true,
      },
    ]);
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    );
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProjects((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Projects
        </h3>
        <button
          onClick={addProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Add Project
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project, index) => (
            <SortablePortfolioProjectItem
              key={project.id}
              project={project}
              index={index}
              editingId={editingId}
              setEditingId={setEditingId}
              updateProject={updateProject}
              removeProject={removeProject}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PortfolioProjects;
