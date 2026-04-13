import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
    return (
        <Drawer>
            <Drawer.Screen
                name="(tabs)"
                options={{ title: "Aplikacija", drawerLabel: "Početne sekcije" }}
            />
            <Drawer.Screen
                name="settings"
                options={{ title: "Postavke", drawerLabel: "Postavke" }}
            />
        </Drawer>
    );
}