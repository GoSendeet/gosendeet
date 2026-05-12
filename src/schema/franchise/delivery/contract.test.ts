import { describe, expect, it } from "vitest";

import type { TaskDto } from "@/services/tasks";
import {
  deriveDeliveryStatus,
  mapFranchiseDelivery,
  mapTaskDtoToDeliveryTask,
} from "./contract";

const baseTask: TaskDto = {
  id: "task-1",
  bookingId: "booking-1",
  companyId: "company-1",
  companyName: "GoSendeet",
  taskType: "DROPOFF",
  status: "ACTIVE",
  destinationAddress: "22 Toyin Street, Ikeja",
  completionRequirement: "PHOTO",
  completeBefore: "2026-03-11T12:00:00",
  completeAfter: "2026-03-11T10:30:00",
  notes: "Deliver parcel",
  dependsOn: ["task-0"],
  createdAt: "2026-03-11T08:00:00",
  updatedAt: "2026-03-11T09:00:00",
};

describe("franchise delivery contract mapping", () => {
  it("maps backend lifecycle enums into the frontend task enums", () => {
    expect(mapTaskDtoToDeliveryTask({ ...baseTask, status: "ACTIVE" }).status).toBe(
      "STARTED",
    );
    expect(
      mapTaskDtoToDeliveryTask({ ...baseTask, status: "DECLINED" }).status,
    ).toBe("CANCELLED");
    expect(
      mapTaskDtoToDeliveryTask({ ...baseTask, status: "TERMINATED" }).status,
    ).toBe("CANCELLED");
    expect(
      mapTaskDtoToDeliveryTask({ ...baseTask, status: "ACCEPTED" }).status,
    ).toBe("DISPATCHED");
  });

  it("preserves signature completion requirements from backend responses", () => {
    expect(
      mapTaskDtoToDeliveryTask({
        ...baseTask,
        completionRequirement: "SIGNATURE",
      }).completionRequirement,
    ).toBe("SIGNATURE");
  });

  it("normalizes proof filenames into url metadata objects", () => {
    const task = mapTaskDtoToDeliveryTask({
      ...baseTask,
      completionProofs: [
        {
          id: "proof-1",
          fileUrl: "https://cdn.gosendeet.test/proof-1.jpg",
          fileName: "proof-1.jpg",
        },
      ],
      proofPhotos: ["https://cdn.gosendeet.test/photo-2.jpg"],
    });

    expect(task.completionProofs).toEqual([
      {
        id: "proof-1",
        url: "https://cdn.gosendeet.test/proof-1.jpg",
        fileName: "proof-1.jpg",
      },
      {
        url: "https://cdn.gosendeet.test/photo-2.jpg",
        fileName: "Photo 2",
        contentType: "image/*",
      },
    ]);
  });

  it("derives delivery labels from normalized task state", () => {
    expect(deriveDeliveryStatus([])).toBe("Pending");
    expect(
      deriveDeliveryStatus([{ taskType: "PICKUP", status: "DISPATCHED" }]),
    ).toBe("Accepted");
    expect(
      deriveDeliveryStatus([{ taskType: "PICKUP", status: "STARTED" }]),
    ).toBe("In Transit");
    expect(
      deriveDeliveryStatus([
        { taskType: "PICKUP", status: "COMPLETED" },
        { taskType: "DROPOFF", status: "DRAFT" },
      ]),
    ).toBe("Picked Up");
    expect(
      deriveDeliveryStatus([
        { taskType: "PICKUP", status: "COMPLETED" },
        { taskType: "DROPOFF", status: "COMPLETED" },
      ]),
    ).toBe("Delivered");
    expect(
      deriveDeliveryStatus([{ taskType: "PICKUP", status: "CANCELLED" }]),
    ).toBe("Declined");
  });

  it("masks customer fields in the franchise delivery view", () => {
    const delivery = mapFranchiseDelivery({
      trackingNumber: "GS-123",
      pickupLocation: "Lekki",
      destination: "Ikeja",
      packageType: "Parcel",
      weight: 2.5,
      weightUnit: "kg",
      earnings: 4500,
      customerName: "Chukwuemeka Obi",
      customerPhone: "0801 234 5678",
      tasks: [{ ...baseTask, status: "DECLINED" }],
    });

    expect(delivery.status).toBe("Declined");
    expect(delivery.customerName).toBe("Chukwuemeka O.");
    expect(delivery.customerPhone).toBe("0801****678");
    expect(delivery.earnings).toBe("₦4,500");
  });
});
