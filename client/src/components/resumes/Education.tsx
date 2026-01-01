import { useState, memo } from "react";
import Input from "../Input";
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
import { ResumeEducation } from "@/types/resume";

const SortableEducationItem = memo(
  ({
    edu,
    index,
    editingId,
    setEditingId,
    updateEducation,
    removeEducation,
  }: {
    edu: ResumeEducation;
    index: number;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    updateEducation: (id: number, field: string, value: string) => void;
    removeEducation: (id: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: edu.id,
        disabled: editingId === edu.id,
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
            <h4 className="text-md font-medium">Education {index + 1}</h4>
          </div>

          <button
            onClick={() => removeEducation(edu.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaRegTrashAlt />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            value={edu.school}
            label="Institution"
            onFocus={() => setEditingId(edu.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
          />

          <Input
            type="text"
            value={edu.degree}
            label="Degree"
            onFocus={() => setEditingId(edu.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
          />

          <Input
            type="text"
            value={edu.field_of_study}
            label="Field of Study"
            onFocus={() => setEditingId(edu.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateEducation(edu.id, "field_of_study", e.target.value)
            }
          />

          <Input
            type="month"
            value={edu.start_date}
            label="Start Date"
            onFocus={() => setEditingId(edu.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateEducation(edu.id, "start_date", e.target.value)
            }
          />

          <Input
            type="month"
            value={edu.graduation_date}
            label="Graduation Date"
            onFocus={() => setEditingId(edu.id)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateEducation(edu.id, "graduation_date", e.target.value)
            }
          />
        </div>
      </div>
    );
  }
);

SortableEducationItem.displayName = "SortableEducationItem";

type EducationProps = {
  education: ResumeEducation[];
  setEducation: React.Dispatch<React.SetStateAction<ResumeEducation[]>>;
};

const Education = ({ education, setEducation }: EducationProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: Date.now(),
        school: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        graduation_date: "",
        isNew: true,
      },
    ]);
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id: number) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEducation((prev) => {
      const oldIndex = prev.findIndex((e) => e.id === active.id);
      const newIndex = prev.findIndex((e) => e.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Education
        </h3>
        <button
          onClick={addEducation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Add Education
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={education.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {education.map((edu, index) => (
            <SortableEducationItem
              key={edu.id}
              edu={edu}
              index={index}
              editingId={editingId}
              setEditingId={setEditingId}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Education;
