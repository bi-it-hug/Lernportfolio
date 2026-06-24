package lb2;

import java.util.Comparator;

public class HunterInsightComparator implements Comparator<Hunter> {

    @Override
    public int compare(Hunter first, Hunter second) {
        return Integer.compare(first.getInsight(), second.getInsight());
    }
}
