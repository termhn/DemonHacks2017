

#ifdef GUI
#include "UFLChoiceDialog.h"
#include <vector>
#include <string>

using namespace std;

ChoiceDialog::ChoiceDialog(wxWindow* parent, int id, const wxString& title, const wxPoint& pos, const wxSize& size, long style):
    wxDialog(parent, id, title, pos, size, wxDEFAULT_DIALOG_STYLE)
{
	label = new wxStaticText(this, wxID_ANY, title);
    const wxString *choices_choices = NULL;
    choices = new wxListBox(this, wxID_ANY, wxDefaultPosition, wxDefaultSize, 0, choices_choices, 0);
    button_1 = new wxButton(this, wxID_OK, wxEmptyString);

    set_properties();
    do_layout();
    SetTitle(title);
}

void ChoiceDialog::set_properties()
{
    SetSize(wxDLG_UNIT(this, wxSize(200, 149)));
}

void ChoiceDialog::do_layout()
{
	wxBoxSizer* sizer_1 = new wxBoxSizer(wxVERTICAL);
	wxBoxSizer* sizer_2 = new wxBoxSizer(wxHORIZONTAL);
	wxGridSizer* grid_sizer_1 = new wxGridSizer(1, 1, 0, 0);
	sizer_1->Add(label, 0, wxLEFT|wxRIGHT|wxTOP|wxEXPAND, 10);
	grid_sizer_1->Add(choices, 0, wxEXPAND, 0);
	sizer_1->Add(grid_sizer_1, 1, wxLEFT|wxRIGHT|wxTOP|wxEXPAND, 10);
	sizer_2->Add(button_1, 0, 0, 0);
	sizer_1->Add(sizer_2, 0, wxALL|wxALIGN_RIGHT, 5);
	SetSizer(sizer_1);
	
	choices->SetFont(wxFont(10, wxDEFAULT, wxNORMAL, wxNORMAL, 0, wxT("Monospace")));
	Layout();
}

void ChoiceDialog::setItems(vector<string> menuItems)
{
	this->choices->Clear();
	for (unsigned int i = 0; i < menuItems.size(); i++)
		this->choices->Append(wxString(menuItems[i].c_str(), wxConvUTF8));
}

int ChoiceDialog::getSelection()
{
	wxArrayInt selections;
	if (this->choices->GetSelections(selections) == 1)
		return selections[0];
	else
		return -1;
}
#endif
