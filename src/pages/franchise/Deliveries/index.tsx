import { useState, useEffect, useMemo } from "react";
import {
  MoreHorizontal,
  ArrowRight,
  Eye,
  RefreshCw,
  Search,
  ChevronDown,
  Package,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DateRangePicker from "@/components/ui/DateRangePicker";
import { DeliveryType } from "@/schema/franchise/delivery/type";
import DeliveryDrawer from "./DeliveryDrawer";

//Lets create an array of data

type statusStyleProps = {
  text: string;
  bg: string;
  border: string;
};

const deliveries: DeliveryType[] = [
  {
    id: "GS-NJ75ZDW",
    isNew: true,
    status: "Pending",
    from: "Lekki",
    to: "Ikeju",
    fromAddress: "14 Admiralty Way, Lekki Phase 1",
    toAddress: "22 Toyin Street, Ikeja",
    customerName: "Chukwuemeka Obi",
    customerPhone: "0801 234 5678",
    package: "Document",
    weight: "0.5 kg",
    date: "2026-03-11",
    time: "10:00 AM",
    earnings: "₦4,800",
    tasks: [
      {
        id: "e8db04a0-7250-4548-8b02-7a8adc1e6b04",
        bookingId: "bb12cec8-760f-4e25-bf5c-8b6a3056e456",
        companyName: "Octave Holdings",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "DRAFT",
        destinationAddress: "14 Admiralty Way, Lekki Phase 1",
        completionRequirement: "NONE",
        completeBefore: "2026-03-11T10:00:00",
        completeAfter: "2026-03-11T09:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Collect package from sender",
        dependsOn: [],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-11T08:00:00",
        updatedAt: "2026-03-11T08:00:00",
        completionProofs: [],
        previewToken: "eyJib29raW5nSWQiOiJiYjEyY2VjOC03NjBmLTRlMjUtYmY1Yy04YjZhMzA1NmU0NTYiLCJjb21wYW55SWQiOiI5OTZmZDQ1YS03ZDU3LTQxMzQtYmU2OS0zOWUxNGM5M2IxNGQiLCJleHBpcnkiOjE3NzQ5NDU5NTl9.2UOD2vHj9qvFoHEpdzfwhbximPHIB7nlP4ZWquXNUc0",
      },
      {
        id: "69cb8506-44ac-4dde-b8a8-820d7a1c4981",
        bookingId: "bb12cec8-760f-4e25-bf5c-8b6a3056e456",
        companyName: "Octave Holdings",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "DRAFT",
        destinationAddress: "22 Toyin Street, Ikeja",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-11T12:00:00",
        completeAfter: "2026-03-11T10:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Deliver to recipient and collect signature/photo",
        dependsOn: ["e8db04a0-7250-4548-8b02-7a8adc1e6b04"],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-11T08:00:00",
        updatedAt: "2026-03-11T08:00:00",
        completionProofs: [],
        previewToken: "eyJib29raW5nSWQiOiJiYjEyY2VjOC03NjBmLTRlMjUtYmY1Yy04YjZhMzA1NmU0NTYiLCJjb21wYW55SWQiOiI5OTZmZDQ1YS03ZDU3LTQxMzQtYmU2OS0zOWUxNGM5M2IxNGQiLCJleHBpcnkiOjE3NzQ5NDU5NTl9.2UOD2vHj9qvFoHEpdzfwhbximPHIB7nlP4ZWquXNUc0",
      },
    ],
  },
  {
    id: "GS-KL92MXP",
    isNew: true,
    status: "Pending",
    from: "Lagos Island",
    to: "Ikeju",
    fromAddress: "8 Broad Street, Lagos Island",
    toAddress: "5 Allen Avenue, Ikeja",
    customerName: "Ngozi Adeyemi",
    customerPhone: "0802 345 6789",
    package: "Parcel",
    weight: "3.2 kg",
    date: "2026-03-11",
    time: "11:00 AM",
    earnings: "₦5,200",
    tasks: [
      {
        id: "a1b2c3d4-0001-0001-0001-000000000001",
        bookingId: "aa11bbcc-0001-0001-0001-000000000001",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "DRAFT",
        destinationAddress: "8 Broad Street, Lagos Island",
        completionRequirement: "NONE",
        completeBefore: "2026-03-11T11:00:00",
        completeAfter: "2026-03-11T10:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Collect parcel from sender",
        dependsOn: [],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-11T09:00:00",
        updatedAt: "2026-03-11T09:00:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0001-0001-0001-000000000002",
        bookingId: "aa11bbcc-0001-0001-0001-000000000001",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "DRAFT",
        destinationAddress: "5 Allen Avenue, Ikeja",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-11T13:00:00",
        completeAfter: "2026-03-11T11:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Deliver parcel and take photo proof",
        dependsOn: ["a1b2c3d4-0001-0001-0001-000000000001"],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-11T09:00:00",
        updatedAt: "2026-03-11T09:00:00",
        completionProofs: [],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-ABC123",
    isNew: false,
    status: "In Transit",
    from: "Victoria Island",
    to: "Ikeju",
    fromAddress: "5 Adeola Odeku Street, VI",
    toAddress: "17 Opebi Road, Ikeja",
    customerName: "Tunde Fashola",
    customerPhone: "0803 456 7890",
    package: "Parcel",
    weight: "1.8 kg",
    date: "2026-03-10",
    time: "8:30 AM",
    earnings: "₦4,500",
    tasks: [
      {
        id: "a1b2c3d4-0002-0002-0002-000000000001",
        bookingId: "aa11bbcc-0002-0002-0002-000000000002",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "STARTED",
        destinationAddress: "5 Adeola Odeku Street, Victoria Island",
        completionRequirement: "NONE",
        completeBefore: "2026-03-10T09:00:00",
        completeAfter: "2026-03-10T08:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Collect parcel from office lobby",
        dependsOn: [],
        dispatchedAt: "2026-03-10T07:45:00",
        respondedAt: "2026-03-10T07:50:00",
        startedAt: "2026-03-10T08:15:00",
        completedAt: null,
        createdAt: "2026-03-10T07:00:00",
        updatedAt: "2026-03-10T08:15:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0002-0002-0002-000000000002",
        bookingId: "aa11bbcc-0002-0002-0002-000000000002",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "DRAFT",
        destinationAddress: "17 Opebi Road, Ikeja",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-10T11:00:00",
        completeAfter: "2026-03-10T09:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Deliver and photograph item at doorstep",
        dependsOn: ["a1b2c3d4-0002-0002-0002-000000000001"],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-10T07:00:00",
        updatedAt: "2026-03-10T07:00:00",
        completionProofs: [],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-DEF456",
    isNew: false,
    status: "Accepted",
    from: "Victoria Island",
    to: "Yaba",
    fromAddress: "3 Ozumba Mbadiwe, VI",
    toAddress: "10 Herbert Macaulay Way, Yaba",
    customerName: "Amaka Eze",
    customerPhone: "0804 567 8901",
    package: "Food",
    weight: "2.0 kg",
    date: "2026-03-10",
    time: "11:30 AM",
    earnings: "₦3,800",
    tasks: [
      {
        id: "a1b2c3d4-0003-0003-0003-000000000001",
        bookingId: "aa11bbcc-0003-0003-0003-000000000003",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "DRAFT",
        destinationAddress: "3 Ozumba Mbadiwe, Victoria Island",
        completionRequirement: "NONE",
        completeBefore: "2026-03-10T12:00:00",
        completeAfter: "2026-03-10T11:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Pick up food order — handle with care",
        dependsOn: [],
        dispatchedAt: null,
        respondedAt: "2026-03-10T10:45:00",
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-10T10:00:00",
        updatedAt: "2026-03-10T10:45:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0003-0003-0003-000000000002",
        bookingId: "aa11bbcc-0003-0003-0003-000000000003",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "DRAFT",
        destinationAddress: "10 Herbert Macaulay Way, Yaba",
        completionRequirement: "SIGNATURE",
        completeBefore: "2026-03-10T13:30:00",
        completeAfter: "2026-03-10T12:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Collect recipient signature on delivery",
        dependsOn: ["a1b2c3d4-0003-0003-0003-000000000001"],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-10T10:00:00",
        updatedAt: "2026-03-10T10:00:00",
        completionProofs: [],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-GHI789",
    isNew: false,
    status: "Picked Up",
    from: "Ikoyi",
    to: "Surulere",
    fromAddress: "12 Bourdillon Road, Ikoyi",
    toAddress: "7 Bode Thomas Street, Surulere",
    customerName: "Babajide Sanwo",
    customerPhone: "0805 678 9012",
    package: "Parcel",
    weight: "4.5 kg",
    date: "2026-03-09",
    time: "8:00 AM",
    earnings: "₦6,200",
    tasks: [
      {
        id: "a1b2c3d4-0004-0004-0004-000000000001",
        bookingId: "aa11bbcc-0004-0004-0004-000000000004",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "COMPLETED",
        destinationAddress: "12 Bourdillon Road, Ikoyi",
        completionRequirement: "NONE",
        completeBefore: "2026-03-09T08:30:00",
        completeAfter: "2026-03-09T07:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Package collected successfully",
        dependsOn: [],
        dispatchedAt: "2026-03-09T07:00:00",
        respondedAt: "2026-03-09T07:10:00",
        startedAt: "2026-03-09T07:45:00",
        completedAt: "2026-03-09T08:05:00",
        createdAt: "2026-03-09T06:00:00",
        updatedAt: "2026-03-09T08:05:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0004-0004-0004-000000000002",
        bookingId: "aa11bbcc-0004-0004-0004-000000000004",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "STARTED",
        destinationAddress: "7 Bode Thomas Street, Surulere",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-09T11:00:00",
        completeAfter: "2026-03-09T09:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "En route — take photo on delivery",
        dependsOn: ["a1b2c3d4-0004-0004-0004-000000000001"],
        dispatchedAt: "2026-03-09T08:10:00",
        respondedAt: null,
        startedAt: "2026-03-09T08:20:00",
        completedAt: null,
        createdAt: "2026-03-09T06:00:00",
        updatedAt: "2026-03-09T08:20:00",
        completionProofs: [],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-JKL012",
    isNew: false,
    status: "Delivered",
    from: "Lagos Island",
    to: "Mushin",
    fromAddress: "2 Marina Road, Lagos Island",
    toAddress: "45 Agege Motor Road, Mushin",
    customerName: "Kemi Balogun",
    customerPhone: "0806 789 0123",
    package: "Document",
    weight: "0.3 kg",
    date: "2026-03-08",
    time: "3:00 PM",
    earnings: "₦3,200",
    tasks: [
      {
        id: "a1b2c3d4-0005-0005-0005-000000000001",
        bookingId: "aa11bbcc-0005-0005-0005-000000000005",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "COMPLETED",
        destinationAddress: "2 Marina Road, Lagos Island",
        completionRequirement: "NONE",
        completeBefore: "2026-03-08T15:30:00",
        completeAfter: "2026-03-08T14:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Document envelope collected",
        dependsOn: [],
        dispatchedAt: "2026-03-08T14:00:00",
        respondedAt: "2026-03-08T14:05:00",
        startedAt: "2026-03-08T14:20:00",
        completedAt: "2026-03-08T14:50:00",
        createdAt: "2026-03-08T13:00:00",
        updatedAt: "2026-03-08T14:50:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0005-0005-0005-000000000002",
        bookingId: "aa11bbcc-0005-0005-0005-000000000005",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "COMPLETED",
        destinationAddress: "45 Agege Motor Road, Mushin",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-08T17:00:00",
        completeAfter: "2026-03-08T15:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Delivered successfully",
        dependsOn: ["a1b2c3d4-0005-0005-0005-000000000001"],
        dispatchedAt: "2026-03-08T15:00:00",
        respondedAt: null,
        startedAt: "2026-03-08T15:10:00",
        completedAt: "2026-03-08T15:55:00",
        createdAt: "2026-03-08T13:00:00",
        updatedAt: "2026-03-08T15:55:00",
        completionProofs: ["photo_proof_jkl012.jpg"],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-MNO345",
    isNew: false,
    status: "Delivered",
    from: "Lekki",
    to: "Ikeju",
    fromAddress: "19 Lekki-Epe Expressway, Lekki",
    toAddress: "33 Obafemi Awolowo Way, Ikeja",
    customerName: "Emeka Nwosu",
    customerPhone: "0807 890 1234",
    package: "Parcel",
    weight: "2.5 kg",
    date: "2026-03-07",
    time: "11:00 AM",
    earnings: "₦5,500",
    tasks: [
      {
        id: "a1b2c3d4-0006-0006-0006-000000000001",
        bookingId: "aa11bbcc-0006-0006-0006-000000000006",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "COMPLETED",
        destinationAddress: "19 Lekki-Epe Expressway, Lekki",
        completionRequirement: "NONE",
        completeBefore: "2026-03-07T11:30:00",
        completeAfter: "2026-03-07T10:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Collect from gate",
        dependsOn: [],
        dispatchedAt: "2026-03-07T10:00:00",
        respondedAt: "2026-03-07T10:05:00",
        startedAt: "2026-03-07T10:20:00",
        completedAt: "2026-03-07T10:55:00",
        createdAt: "2026-03-07T09:00:00",
        updatedAt: "2026-03-07T10:55:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0006-0006-0006-000000000002",
        bookingId: "aa11bbcc-0006-0006-0006-000000000006",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "COMPLETED",
        destinationAddress: "33 Obafemi Awolowo Way, Ikeja",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-07T13:00:00",
        completeAfter: "2026-03-07T11:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Photo taken on delivery",
        dependsOn: ["a1b2c3d4-0006-0006-0006-000000000001"],
        dispatchedAt: "2026-03-07T11:00:00",
        respondedAt: null,
        startedAt: "2026-03-07T11:10:00",
        completedAt: "2026-03-07T12:30:00",
        createdAt: "2026-03-07T09:00:00",
        updatedAt: "2026-03-07T12:30:00",
        completionProofs: ["photo_proof_mno345.jpg"],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-PQR678",
    isNew: false,
    status: "Delivered",
    from: "Ikoyi",
    to: "Surulere",
    fromAddress: "8 Kingsway Road, Ikoyi",
    toAddress: "22 Adeniran Ogunsanya Street, Surulere",
    customerName: "Funmi Adeleke",
    customerPhone: "0808 901 2345",
    package: "Parcel",
    weight: "1.2 kg",
    date: "2026-03-06",
    time: "10:30 AM",
    earnings: "₦4,200",
    tasks: [
      {
        id: "a1b2c3d4-0007-0007-0007-000000000001",
        bookingId: "aa11bbcc-0007-0007-0007-000000000007",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "COMPLETED",
        destinationAddress: "8 Kingsway Road, Ikoyi",
        completionRequirement: "NONE",
        completeBefore: "2026-03-06T11:00:00",
        completeAfter: "2026-03-06T10:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Collect parcel at reception",
        dependsOn: [],
        dispatchedAt: "2026-03-06T09:30:00",
        respondedAt: "2026-03-06T09:40:00",
        startedAt: "2026-03-06T10:00:00",
        completedAt: "2026-03-06T10:25:00",
        createdAt: "2026-03-06T08:00:00",
        updatedAt: "2026-03-06T10:25:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0007-0007-0007-000000000002",
        bookingId: "aa11bbcc-0007-0007-0007-000000000007",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "COMPLETED",
        destinationAddress: "22 Adeniran Ogunsanya Street, Surulere",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-06T13:00:00",
        completeAfter: "2026-03-06T11:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Delivered and photo captured",
        dependsOn: ["a1b2c3d4-0007-0007-0007-000000000001"],
        dispatchedAt: "2026-03-06T10:30:00",
        respondedAt: null,
        startedAt: "2026-03-06T10:40:00",
        completedAt: "2026-03-06T11:50:00",
        createdAt: "2026-03-06T08:00:00",
        updatedAt: "2026-03-06T11:50:00",
        completionProofs: ["photo_proof_pqr678.jpg"],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-STU901",
    isNew: false,
    status: "Declined",
    from: "Victoria Island",
    to: "Ikeju",
    fromAddress: "1 Sanusi Fafunwa Street, Victoria Island",
    toAddress: "9 Awolowo Road, Ikeja",
    customerName: "Rotimi Adesanya",
    customerPhone: "0809 012 3456",
    package: "Large Parcel",
    weight: "12.0 kg",
    date: "2026-03-05",
    time: "4:30 PM",
    earnings: "₦8,500",
    tasks: [
      {
        id: "a1b2c3d4-0008-0008-0008-000000000001",
        bookingId: "aa11bbcc-0008-0008-0008-000000000008",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "CANCELLED",
        destinationAddress: "1 Sanusi Fafunwa Street, Victoria Island",
        completionRequirement: "NONE",
        completeBefore: "2026-03-05T17:00:00",
        completeAfter: "2026-03-05T16:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Declined — vehicle too small for large parcel",
        dependsOn: [],
        dispatchedAt: "2026-03-05T15:30:00",
        respondedAt: "2026-03-05T15:45:00",
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-05T15:00:00",
        updatedAt: "2026-03-05T15:45:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0008-0008-0008-000000000002",
        bookingId: "aa11bbcc-0008-0008-0008-000000000008",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "CANCELLED",
        destinationAddress: "9 Awolowo Road, Ikeja",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-05T19:00:00",
        completeAfter: "2026-03-05T17:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Cancelled due to declined pickup",
        dependsOn: ["a1b2c3d4-0008-0008-0008-000000000001"],
        dispatchedAt: null,
        respondedAt: null,
        startedAt: null,
        completedAt: null,
        createdAt: "2026-03-05T15:00:00",
        updatedAt: "2026-03-05T15:45:00",
        completionProofs: [],
        previewToken: "",
      },
    ],
  },
  {
    id: "GS-VWX234",
    isNew: true,
    status: "In Transit",
    from: "Victoria Island",
    to: "Yaba",
    fromAddress: "4 Kofo Abayomi Street, Victoria Island",
    toAddress: "18 Tejuosho Street, Yaba",
    customerName: "Yetunde Okonkwo",
    customerPhone: "0810 123 4567",
    package: "Parcel",
    weight: "1.5 kg",
    date: "2026-03-04",
    time: "9:00 AM",
    earnings: "₦5,000",
    tasks: [
      {
        id: "a1b2c3d4-0009-0009-0009-000000000001",
        bookingId: "aa11bbcc-0009-0009-0009-000000000009",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "PICKUP",
        status: "COMPLETED",
        destinationAddress: "4 Kofo Abayomi Street, Victoria Island",
        completionRequirement: "NONE",
        completeBefore: "2026-03-04T09:30:00",
        completeAfter: "2026-03-04T08:30:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "Package collected from office",
        dependsOn: [],
        dispatchedAt: "2026-03-04T08:00:00",
        respondedAt: "2026-03-04T08:10:00",
        startedAt: "2026-03-04T08:40:00",
        completedAt: "2026-03-04T09:05:00",
        createdAt: "2026-03-04T07:00:00",
        updatedAt: "2026-03-04T09:05:00",
        completionProofs: [],
        previewToken: "",
      },
      {
        id: "a1b2c3d4-0009-0009-0009-000000000002",
        bookingId: "aa11bbcc-0009-0009-0009-000000000009",
        companyName: "GoSendeet",
        companyId: "996fd45a-7d57-4134-be69-39e14c93b14d",
        taskType: "DROPOFF",
        status: "STARTED",
        destinationAddress: "18 Tejuosho Street, Yaba",
        completionRequirement: "PHOTO",
        completeBefore: "2026-03-04T12:00:00",
        completeAfter: "2026-03-04T10:00:00",
        estimatedTime: null,
        estimatedTimeWindowStart: null,
        estimatedTimeWindowEnd: null,
        notes: "En route to dropoff — take photo proof",
        dependsOn: ["a1b2c3d4-0009-0009-0009-000000000001"],
        dispatchedAt: "2026-03-04T09:10:00",
        respondedAt: null,
        startedAt: "2026-03-04T09:20:00",
        completedAt: null,
        createdAt: "2026-03-04T07:00:00",
        updatedAt: "2026-03-04T09:20:00",
        completionProofs: [],
        previewToken: "",
      },
    ],
  },
];

const statusStyles: Record<string, statusStyleProps> = {
  Pending: {
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  "In Transit": {
    text: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  Accepted: {
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  "Picked Up": {
    text: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  Delivered: {
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Declined: { text: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
};

const statusTabs = [
  { label: "All Status", status: "", count: 10 },
  {
    label: "Pending",
    status: "PENDING",
    count: 2,
  },
  {
    label: "Active",
    status: ["IN_TRANSIT", "ACCEPTED", "PICKED_UP"],
    count: 4,
  },
  {
    label: "Completed",
    status: "DELIVERED",
    count: 4,
  },
];

const statusOptions = [
  "All Status",
  "Pending",
  "In Transit",
  "Accepted",
  "Picked Up",
  "Delivered",
  "Declined",
];

const tabStatusMap: Record<string, string[]> = {
  "All Status": [],
  Pending: ["Pending"],
  Active: ["In Transit", "Accepted", "Picked Up"],
  Completed: ["Delivered"],
};

const Deliveries = ({
  initialStatusTab = "All Status",
}: {
  initialStatusTab?: string;
}) => {
  const [activeTab, setActiveTab] = useState(initialStatusTab);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>(
    null,
  );

  const openDrawer = (delivery: DeliveryType) => {
    setSelectedDelivery(delivery);
    setDrawerOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatus = (option: string) => {
    setStatusFilter(option);
    setActiveTab("All Status");
    setDropdownOpen(false);
  };

  // Replace `deliveries` with API data (e.g. from useQuery) when backend is ready
  const filteredDeliveries: DeliveryType[] = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return deliveries.filter((row) => {
      const tabStatuses = tabStatusMap[activeTab] ?? [];
      const matchesTab =
        tabStatuses.length === 0 || tabStatuses.includes(row.status);
      const matchesDropdown =
        statusFilter === "All Status" || row.status === statusFilter;
      const matchesSearch =
        !q ||
        row.id.toLowerCase().includes(q) ||
        row.from.toLowerCase().includes(q) ||
        row.to.toLowerCase().includes(q);
      const matchesDate =
        (!dateRange.from || row.date >= dateRange.from) &&
        (!dateRange.to || row.date <= dateRange.to);
      return matchesTab && matchesDropdown && matchesSearch && matchesDate;
    });
  }, [activeTab, statusFilter, debouncedSearch, dateRange]);

  const allSelected =
    selected.length === filteredDeliveries.length &&
    filteredDeliveries.length > 0;

  const toggleAll = () => {
    setSelected(allSelected ? [] : filteredDeliveries.map((d) => d.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <h1 className="text-sm lg:text-lg font-bold text-brand">
          Deliveries & Tasks
        </h1>
        <p className="text-sm lg:text-base text-frch-text-gray mt-2">
          Manage your pickup and delivery tasks
        </p>
      </div>

      {/* statusTabs and calender sorting */}
      <div className="w-full flex flex-col lg:flex-row items-start md:items-center justify-between mt-6">
        {/* statusTabs  */}
        <div className="grid grid-cols-2 md:flex flex-row items-center font-inter gap-3 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-xl border text-sm ${
                activeTab === tab.label
                  ? "bg-green900 text-white border-green900"
                  : "bg-white text-[#8E8E8E] border-gray-200"
              }`}
              onClick={() => {
                setActiveTab(tab.label);
                setStatusFilter("All Status");
              }}
            >
              {tab.label}
              <span
                className={` text-xs font-medium px-1 py-0.3 rounded-full ${
                  activeTab === tab.label ? "text-white" : "text-[#8E8E8E]"
                }`}
              >
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Date range picker */}
        <div className="mt-4 lg:mt-0">
          <DateRangePicker
            onRangeChange={(from, to) => setDateRange({ from, to })}
          />
        </div>
      </div>

      {/* Search by tracking Id or by route and status filtering */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-12 mt-6">
        <div className="w-full flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5 border border-gray100 focus-within:border-gray-300 focus-within:bg-white transition-all">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Tracking ID, area..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Dropdown to filter by status */}
        <div className="relative w-full">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center justify-between w-40 bg-gray-100 hover:bg-gray-200 border border-gray100 hover:border-gray-300 rounded-lg px-2 py-2.5 text-sm text-gray-600 font-medium transition-all whitespace-nowrap"
          >
            {statusFilter}
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100/80 z-10 overflow-hidden">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleStatus(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                    statusFilter === option
                      ? "text-emerald-600 font-semibold bg-emerald-50/60"
                      : "text-gray-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* card showing deliveries for mobile version */}
      <div className="flex flex-col gap-4 md:hidden mt-6">
        {filteredDeliveries.map((row) => {
          const style = statusStyles[row.status] ?? statusStyles.Pending;

          const cardBorder: Record<string, string> = {
            Pending: "border-amber-300",
            Accepted: "border-emerald-300",
            "In Transit": "border-orange-300",
            "Picked Up": "border-purple-300",
            Delivered: "border-gray-200",
            Declined: "border-red-200",
          };

          const renderCTA = () => {
            const viewDetails = (
              <button 
                className="w-full flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => openDrawer(row)}
              >
                View Details
              </button>
            );
            switch (row.status) {
              case "Pending":
                return (
                  <div className="flex gap-2 mt-1">
                    <button 
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                       onClick={() => openDrawer(row)}
                    >
                      Review & Accept
                    </button>
                  </div>
                );
              case "Accepted":
                return (
                  <div className="flex gap-2 mt-1">
                    {viewDetails}
                    <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-emerald-600 border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      Start Pickup
                    </button>
                  </div>
                );
              case "In Transit":
              case "Picked Up":
                return (
                  <div className="flex gap-2 mt-1">
                    {viewDetails}
                    <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                      Complete Delivery
                    </button>
                  </div>
                );
              default:
                return <div className="mt-1">{viewDetails}</div>;
            }
          };

          return (
            <div
              key={row.id}
              className={`bg-white rounded-2xl border-2 ${cardBorder[row.status] ?? "border-gray-200"} shadow-sm p-4 flex flex-col gap-3`}
            >
              {/* Top row: ID + NEW badge + Earnings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 tracking-wide text-sm">
                    {row.id}
                  </span>
                  {row.isNew && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
                <span className="font-bold text-gray-800 text-sm">
                  {row.earnings}
                </span>
              </div>

              {/* Status badge */}
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style.text} ${style.bg} ${style.border}`}
                >
                  {row.status}
                </span>
              </div>

              {/* Route */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-600">
                    {row.from ?? `${row.from}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span className="text-sm text-gray-600">
                    {row.to ?? `${row.to}`}
                  </span>
                </div>
              </div>

              {/* Meta row: package + time + chevron */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Package size={12} />
                    <span>
                      {row.package} · {row.weight}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{row.time}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>

              {/* CTA */}
              {renderCTA()}
            </div>
          );
        })}
      </div>

      {/* Table showing deliveries desktop version */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-200 accent-brand cursor-pointer"
                  />
                </th>
                {[
                  "Tracking ID",
                  "Status",
                  "Route",
                  "Package",
                  "Time",
                  "Earnings",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredDeliveries.map((row) => {
                const style = statusStyles[row.status] ?? statusStyles.Pending;
                const isChecked = selected.includes(row.id);

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-gray-50/70 ${isChecked ? "bg-emerald-50/30" : ""}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOne(row.id)}
                        className="rounded-md border-gray-300 accent-brand cursor-pointer"
                      />
                    </td>

                    {/* Tracking ID */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 tracking-wide">
                          {row.id}
                        </span>
                        {row.isNew && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style.text} ${style.bg} ${style.border}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Route */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <span>{row.from}</span>
                        <ArrowRight
                          size={13}
                          className="text-gray-400 shrink-0"
                        />
                        <span className="font-semibold">{row.to}</span>
                      </div>
                    </td>

                    {/* Package */}
                    <td className="px-3 py-3 text-gray-500">
                      {row.package}
                      <span className="text-gray-400"> · {row.weight}</span>
                    </td>

                    {/* Time */}
                    <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                      {row.time}
                    </td>

                    {/* Earnings */}
                    <td className="px-3 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      {row.earnings}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <Popover open={openPopoverId === row.id} onOpenChange={(open) => setOpenPopoverId(open ? row.id : null)}>
                        <PopoverTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="center" className="w-44 p-1">
                          <button
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => { setOpenPopoverId(null); openDrawer(row); }}
                          >
                            <Eye size={14} />
                            View full details
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            <RefreshCw size={14} />
                            Update progress
                          </button>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      <DeliveryDrawer
        delivery={selectedDelivery}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAccept={(d) => console.log("✅ Accepted:", d.id)}
        onDecline={(d) => console.log("❌ Declined:", d.id)}
      />
    </>
  );
};

export default Deliveries;
