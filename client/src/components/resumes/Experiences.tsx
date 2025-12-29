import { memo, useState } from "react";
import { SingleResumeExperience } from "@/types/resume";
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

type ExperienceProp = {
  experience: SingleResumeExperience[];
  setExperience: React.Dispatch<React.SetStateAction<SingleResumeExperience[]>>;
};

const SortableExperienceItem = memo(
  ({
    experience,
    index,
    editingId,
    setEditingId,
    updateExperience,
    removeExperience,
  }: {
    experience: SingleResumeExperience;
    index: number;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    updateExperience: (id: number, field: string, value: string) => void;
    removeExperience: (id: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: experience.id,
        disabled: editingId === experience.id,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        style={style}
        {...attributes}
        ref={setNodeRef}
        key={`experience-${experience.id}`}
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
            <h4 className="text-md font-medium">Experience {index + 1}</h4>
          </div>
          <button
            onClick={() => removeExperience(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              value={experience.company}
              label="Company"
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
              name="company"
              onFocus={() => setEditingId(experience.id)}
              onBlur={() => setEditingId(null)}
            />
          </div>
          <div>
            <Input
              label="Position"
              type="text"
              value={experience.position}
              onChange={(e) =>
                updateExperience(index, "position", e.target.value)
              }
              onFocus={() => setEditingId(experience.id)}
              onBlur={() => setEditingId(null)}
            />
          </div>
          <div>
            <Input
              label="Start Date"
              type="month"
              value={experience.start_date}
              onChange={(e) =>
                updateExperience(index, "start_date", e.target.value)
              }
              onFocus={() => setEditingId(experience.id)}
              onBlur={() => setEditingId(null)}
            />
          </div>
          <div>
            <Input
              label="End Date"
              type="month"
              value={experience.end_date}
              onChange={(e) =>
                updateExperience(index, "end_date", e.target.value)
              }
              onFocus={() => setEditingId(experience.id)}
              onBlur={() => setEditingId(null)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            label="Description"
            value={experience.description}
            onChange={(e) =>
              updateExperience(index, "description", e.target.value)
            }
            rows={3}
            onFocus={() => setEditingId(experience.id)}
            onBlur={() => setEditingId(null)}
          />
        </div>
      </div>
    );
  }
);

const Experiences = ({ experience, setExperience }: ExperienceProp) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
    };
    setExperience((prev) => [...prev, newExp]);
  };

  const updateExperience = (id: number, field: string, value: string) => {
    setExperience((prev) =>
      prev.map((exp, index) =>
        index === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: number) => {
    setExperience((prev: SingleResumeExperience[]) =>
      prev.filter((exp) => exp.id !== id)
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setExperience((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Work Experience
        </h3>
        <button
          onClick={addExperience}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Add Experience
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={experience.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {experience.map((experience, index) => (
            <SortableExperienceItem
              key={experience.id}
              experience={experience}
              index={index}
              editingId={editingId}
              setEditingId={setEditingId}
              updateExperience={updateExperience}
              removeExperience={removeExperience}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* {experience.map((exp, index) => (
        <div
          key={`experience-${index}`}
          className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-md font-medium">Experience {index + 1}</h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                value={exp.company}
                label="Company"
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                name="company"
              />
            </div>
            <div>
              <Input
                label="Position"
                type="text"
                value={exp.position}
                onChange={(e) =>
                  updateExperience(index, "position", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                label="Start Date"
                type="month"
                value={exp.start_date}
                onChange={(e) =>
                  updateExperience(index, "start_date", e.target.value)
                }
              />
            </div>
            <div>
              <Input
                label="End Date"
                type="month"
                value={exp.end_date}
                onChange={(e) =>
                  updateExperience(index, "end_date", e.target.value)
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              value={exp.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              rows={3}
            />
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default Experiences;
