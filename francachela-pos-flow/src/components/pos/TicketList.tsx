import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Ticket } from "@/types/pos.types";

interface TicketListProps {
  tickets: Ticket[];
  activeTicketId: string;
  onTicketSelect: (ticketId: string) => void;
  onTicketDelete: (ticketId: string) => void;
  onNewTicket: () => void;
}

export const TicketList = ({
  tickets,
  activeTicketId,
  onTicketSelect,
  onTicketDelete,
  onNewTicket,
}: TicketListProps) => {
  const activeTickets = tickets.filter(t => t.status !== 'deleted');

  return (
    <Card className="pos-card border-blue-500 bg-blue-50">
      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`border-2 rounded-lg p-3 min-w-[140px] cursor-pointer transition-all relative m-2 ${
                  ticket.id === activeTicketId
                    ? 'border-blue-600 bg-blue-100 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                }`}
                onClick={() => onTicketSelect(ticket.id)}
              >
                <div className="text-sm font-semibold text-gray-800">{ticket.id}</div>
                <div className="text-xs text-gray-600">
                  {ticket.items.length} items
                </div>
                <div className="text-sm font-bold text-blue-600">
                  S/. {ticket.total.toFixed(2)}
                </div>
                
                {activeTickets.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-purple-700 text-white hover:bg-purple-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTicketDelete(ticket.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button 
            onClick={onNewTicket} 
            size="sm" 
            className="touch-target bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nuevo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
