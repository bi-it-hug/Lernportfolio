"use client";

import * as IonIcons from "react-ionicons";

export function IonIcon({ Icon, ClassName }: { Icon: string; ClassName?: string }) {
    const globalClasses = "size-(--icon-size)";

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

        case "Person":
            return <IonIcons.Person className={`${globalClasses} ${ClassName}`} />;

        case "Person":
            return <IonIcons.Person className={`${globalClasses} ${ClassName}`} />;

        case "Hammer":
            return <IonIcons.Hammer className={`${globalClasses} ${ClassName}`} />;

        case "Document":
            return <IonIcons.Document className={`${globalClasses} ${ClassName}`} />;

        case "Mail":
            return <IonIcons.Mail className={`${globalClasses} ${ClassName}`} />;

        case "Settings":
            return <IonIcons.Settings className={`${globalClasses} ${ClassName}`} />;

        case "Checkbox":
            return <IonIcons.Checkbox className={`${globalClasses} ${ClassName}`} />;

        case "Search":
            return <IonIcons.Search className={`${globalClasses} ${ClassName}`} />;

        case "Contrast":
            return <IonIcons.Contrast className={`${globalClasses} ${ClassName}`} />;

        case "ContrastOutline":
            return <IonIcons.ContrastOutline className={`${globalClasses} ${ClassName}`} />;

        case "LogoIonic":
            return <IonIcons.LogoIonic className={`${globalClasses} ${ClassName}`} />;

        case "Add":
            return <IonIcons.Add className={`${globalClasses} ${ClassName}`} />;
    }
}
