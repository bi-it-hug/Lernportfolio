import { Card, CardTitle, CardHeader, CardContent } from "@/app/components/card";
import { Main } from "@/app/components/main";

export default async function Test() {
    return (
        <Main>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
        </Main>
    );
}
