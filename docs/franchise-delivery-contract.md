# Franchise Delivery Contract

This frontend contract normalizes task responses from the backend into the delivery states used by the franchise dashboard and drawer.

## Status Mapping

Backend task statuses map to franchise task statuses as follows:

| Backend status | Franchise task status | Delivery label impact |
| --- | --- | --- |
| `DRAFT` | `DRAFT` | Pending |
| `DISPATCHED` | `DISPATCHED` | Accepted |
| `ACCEPTED` | `DISPATCHED` | Accepted |
| `ACTIVE` | `STARTED` | In Transit |
| `COMPLETED` | `COMPLETED` | Picked Up or Delivered |
| `DECLINED` | `CANCELLED` | Declined |
| `CANCELLED` | `CANCELLED` | Declined |
| `TERMINATED` | `CANCELLED` | Declined |

Delivery labels are derived from normalized tasks in this order:

1. Any `CANCELLED` task: `Declined`
2. All tasks `COMPLETED`: `Delivered`
3. Pickup task `COMPLETED` while dropoff remains open: `Picked Up`
4. Any `STARTED` task: `In Transit`
5. Any `DISPATCHED` task: `Accepted`
6. Otherwise: `Pending`

## Completion Requirements

Franchise delivery responses accept `NONE`, `PHOTO`, and `SIGNATURE`. Signature is response-safe in the frontend contract so existing mock delivery screens and future backend responses serialize correctly.

Task creation and update requests remain backward compatible with the current backend by sending only `NONE` or `PHOTO`. Full signature capture requires backend support for DB enum/check constraints, entity validation, upload or signature capture, and completion flow enforcement before the admin task forms should send `SIGNATURE`.

## Proofs

Franchise screens consume completion proofs as URL metadata objects:

```ts
type DeliveryProof = {
  id?: string;
  url: string;
  fileName?: string;
  contentType?: string;
  uploadedAt?: string;
};
```

The mapper accepts existing backend `completionProofs[].url`, `completionProofs[].fileUrl`, and legacy `proofPhotos[]`, then emits normalized proof objects. Screens should not depend on raw filenames as proof identifiers.

## Customer Privacy

Franchise delivery views receive masked customer display fields from `mapFranchiseDelivery`:

| Source field | Franchise display |
| --- | --- |
| `customerName` or `senderName` | First name plus last initial |
| `customerPhone` or `senderPhone` | First four digits, four mask characters, last three digits |

Backend responses should prefer already-masked franchise fields when available, but frontend mapping keeps masking in place as a defensive privacy boundary.

