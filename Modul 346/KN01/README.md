# KN01

> [!IMPORTANT]
> Im untenstehenden Screenshot ist zu sehen, dass mein Host-System über 24 logische Prozessoren und 32 GB Arbeitsspeicher verfügt.

![](screenshots/mem-host.png)
![](screenshots/cpu-host.png)

***

Im folgenden Screenshot ist zu erkennen, dass dem Server lediglich 6 CPU-Kerne zugewiesen wurden.

![](screenshots/cpu-less.png)

***

Dieser Screenshot zeigt eine Fehlermeldung, die erscheint, nachdem ich versucht habe, dem Server 32 CPU-Kerne zuzuweisen.

![](screenshots/cpu-fail.png)

***

Im nächsten Screenshot ist ersichtlich, dass dem Server nur 7 GB Arbeitsspeicher zugewiesen wurden.

![](screenshots/mem-less.png)

***

Dieser Screenshot zeigt eine Fehlermeldung, die erscheint, nachdem ich versucht habe, dem Server 64 GB Arbeitsspeicher zuzuweisen.

![](screenshots/mem-fail.png)

***

> [!IMPORTANT]
> Es ist grundsätzlich nicht möglich, einer virtuellen Maschine mehr CPU-Kerne oder RAM zuzuweisen, als das Host-System zur Verfügung stellt. Eine virtuelle Maschine kann nur die physischen Ressourcen nutzen, die tatsächlich auf dem Host vorhanden sind. Die Zuweisung dieser Ressourcen wird von Hypervisoren verwaltet, um sicherzustellen, dass die Verteilung der Ressourcen im Rahmen der physisch verfügbaren Kapazitäten bleibt. Obwohl es Techniken wie Overcommitment gibt, bei denen mehr virtuelle Ressourcen zugewiesen werden, als physisch vorhanden sind, kann dies zu erheblichen Leistungseinbussen führen, wenn die VMs tatsächlich versuchen, mehr Ressourcen zu nutzen, als verfügbar sind.
