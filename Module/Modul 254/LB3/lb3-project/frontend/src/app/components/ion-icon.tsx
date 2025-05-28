"use client";

import * as IonIcons from "react-ionicons";

export function IonIcon({ Icon, ClassName }: { Icon: string; ClassName?: string }) {
    const globalClasses = "";

    switch (Icon) {
        case "CaretForward":
            return <IonIcons.CaretForwardOutline className={`${globalClasses} ${ClassName}`} />;

        case "CaretBack":
            return <IonIcons.CaretBack className={`${globalClasses} ${ClassName}`} />;

        case "Checkmark":
            return <IonIcons.CheckmarkOutline className={`${globalClasses} ${ClassName}`} />;

        case "CheckmarkDone":
            return <IonIcons.CheckmarkDoneOutline className={`${globalClasses} ${ClassName}`} />;

        case "Trash":
            return <IonIcons.TrashOutline className={`${globalClasses} ${ClassName}`} />;

        case "TrashBin":
            return <IonIcons.TrashBinOutline className={`${globalClasses} ${ClassName}`} />;

        case "Pencil":
            return <IonIcons.PencilOutline className={`${globalClasses} ${ClassName}`} />;

        case "Brush":
            return <IonIcons.BrushOutline className={`${globalClasses} ${ClassName}`} />;

        case "Add":
            return <IonIcons.AddOutline className={`${globalClasses} ${ClassName}`} />;

        case "AddCircle":
            return <IonIcons.AddCircleOutline className={`${globalClasses} ${ClassName}`} />;

        case "Create":
            return <IonIcons.CreateOutline className={`${globalClasses} ${ClassName}`} />;

        case "Home":
            return <IonIcons.Home className={`${globalClasses} ${ClassName}`} />;

        case "Cog":
            return <IonIcons.Cog className={`${globalClasses} ${ClassName}`} />;

        case "Warning":
            return <IonIcons.Warning className={`${globalClasses} ${ClassName}`} />;
    }
}
