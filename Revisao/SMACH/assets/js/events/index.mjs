import { LoadEvents as LoadProductEvents } from "./productEvents.mjs";
import { LoadEvents as LoadOrdersEvents } from "./orderEvents.mjs";
import { LoadEvents as LoadNotifyEvents } from "./notifyEvents.mjs";

export default function LoadEvents(){
    LoadProductEvents();
    LoadOrdersEvents();
    LoadNotifyEvents();
}