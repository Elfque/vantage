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
import { ResumeProject } from "@/types/resume";

type ProjectItem = {
  id: number;
  title: string;
  description: string;
  technologies: string;
  link: string;
};

const SortableProjectItem = memo(
  ({
    project,
    index,
    editingId,
    setEditingId,
    updateProject,
    removeProject,
  }: {
    project: ProjectItem;
    index: number;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    updateProject: (id: number, field: string, value: string) => void;
    removeProject: (id: number) => void;
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
        {...attributes}
        className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div
              {...listeners}
              className="cursor-move text-gray-400 hover:text-gray-600"
            >
              <FaGripVertical />
            </div>
            <h4 className="text-md font-medium">Project {index + 1}</h4>
          </div>

          <button
            onClick={() => removeProject(project.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaRegTrashAlt />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            label="Project Name"
            value={project.title}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateProject(project.id, "title", e.target.value)}
          />

          <Textarea
            label="Description"
            rows={3}
            value={project.description}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateProject(project.id, "description", e.target.value)
            }
          />

          <Input
            type="text"
            label="Technologies used"
            placeholder="e.g., React, Node.js, MongoDB"
            value={project.technologies}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateProject(project.id, "technologies", e.target.value)
            }
          />

          <Input
            type="url"
            label="Project Link"
            placeholder="https://yourprojectlink.com"
            value={project.link}
            onFocus={() => setEditingId(project.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateProject(project.id, "link", e.target.value)}
          />
        </div>
      </div>
    );
  }
);

SortableProjectItem.displayName = "SortableProjectItem";

// ---------------- Main Component ----------------
const Projects = ({
  projects,
  setProjects,
}: {
  projects: ResumeProject[];
  setProjects: React.Dispatch<React.SetStateAction<ResumeProject[]>>;
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        technologies: "",
        link: "",
      },
    ]);
  };

  const updateProject = (id: number, field: string, value: string) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    );
  };

  const removeProject = (id: number) => {
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
            <SortableProjectItem
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

export default Projects;
